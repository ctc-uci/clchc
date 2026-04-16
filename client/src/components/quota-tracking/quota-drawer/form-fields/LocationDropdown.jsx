import { useEffect, useRef, useState } from "react";

import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Skeleton,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";

import {
  useCreateLocation,
  useDeleteLocation,
  useLocations,
} from "@/contexts/hooks/data-fetching/useLocations";
import CustomSelect from "@/components/common/CustomSelect";

import { LockRightElement } from "../tools/shared";
import { MdDeleteOutline } from "react-icons/md";

export function LocationDropdown({ locations = [], locationId, setLocationId, isLocked, isInvalid }) {
  const createLocation = useCreateLocation();
  const deleteLocation = useDeleteLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newValue, setNewValue] = useState("");
  const [deletingMap, setDeletingMap] = useState({});
  const toast = useToast();
  const selectedItemRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        selectedItemRef.current?.scrollIntoView({ block: "nearest" });
      }, 0);
    }
  }, [isOpen]);

  const options = locations.map((l) => ({
    value: String(l.id),
    label: l.tagValue,
  }));
  const selectedLocation = locations.find(
    (location) => String(location.id) === String(locationId)
  );

  const handleCreate = async (e) => {
    e.stopPropagation();
    const trimmed = newValue.trim();
    if (!trimmed) return;

    try {
      const result = await createLocation.mutateAsync({ tagValue: trimmed });
      const newLocation = Array.isArray(result) ? result[0] : result;
      if (newLocation?.id) setLocationId(newLocation.id);
      setNewValue("");
      onClose();
    } catch (_err) {
      toast({
        title: "Error",
        description: "Failed to create location",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = (location) => (e) => {
    e.stopPropagation();
    const id = location.id;
    setDeletingMap((m) => ({ ...m, [id]: true }));

    deleteLocation.mutate(
      { id },
      {
        onSuccess: () => {
          setLocationId((prev) => (String(id) === String(prev) ? "" : prev));
        },
        onSettled: () =>
          setDeletingMap((m) => {
            const copy = { ...m };
            delete copy[id];
            return copy;
          }),
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete location",
            status: "error",
            position: "bottom-right",
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );
  };

  return (
    <FormControl
      isRequired
      w="50%"
      isDisabled={isLocked}
      isInvalid={isInvalid}
    >
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >
        Location
      </FormLabel>
      {isLocked ? (
        <InputGroup>
          <Box
            w="100%"
            border="1px"
            borderColor="gray.300"
            borderRadius="6px"
            px={3}
            py={2}
            fontSize="14px"
            pr="2.25rem"
            bg="gray.50"
            color="gray.500"
          >
            {selectedLocation?.tagValue ?? ""}
          </Box>
          <LockRightElement />
        </InputGroup>
      ) : (
        <Menu
          closeOnSelect={true}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          matchWidth
        >
          <MenuButton
            as={Button}
            variant="outline"
            w="100%"
            justifyContent="flex-start"
            textAlign="left"
            rightIcon={<ChevronDown size={20} />}
            color={"var(--gray-700, #2D3748)"}
            fontFamily={"Inter"}
            fontSize={"14px"}
            fontWeight={"400"}
            lineHeight={"20px"}
            fontStyle={"normal"}
            borderRadius={"4px"}
            border={isInvalid ? "1px solid #FC8181" : "1px solid var(--gray-200, #E2E8F0)"}
            background={"var(--white, #FFF)"}
          >
            {selectedLocation?.tagValue
              ? selectedLocation.tagValue.length > 16
                ? selectedLocation.tagValue.slice(0, 16) + "..."
                : selectedLocation.tagValue
              : "Select"}
          </MenuButton>
          <MenuList
            maxHeight="240px"
            overflowY="auto"
            minW="0"
          >
            <MenuOptionGroup
              title=""
              type="radio"
              value={locationId === "" ? "" : String(locationId)}
              onChange={(value) => setLocationId(Number(value))}
            >
              {locations.map((location) => (
                <MenuItemOption
                  key={location.id}
                  value={String(location.id)}
                  ref={String(location.id) === String(locationId) ? selectedItemRef : null}
                  pl="3"
                  pr="0"
                >
                  <HStack
                    justifyContent="space-between"
                    w="100%"
                  >
                    <Text flex="1" fontSize="12px" fontWeight="400">{location.tagValue}</Text>
                    <Button
                      as="span"
                      variant="ghost"
                      onClick={handleDelete(location)}
                      isLoading={!!deletingMap[location.id]}
                    >
                      <MdDeleteOutline size={20} />
                    </Button>
                  </HStack>
                </MenuItemOption>
              ))}
              <HStack
                px={3}
                py={2}
                gap={2}
              >
                <Input
                  placeholder="Enter location"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  variant="outline"
                  fontFamily={"Inter"}
                  fontStyle={"normal"}
                  lineHeight={"20px"}
                  fontSize="12px"
                  fontWeight="400"
                  color="black"
                  border={"1px solid var(--gray-200, #E2E8F0)"}
                  borderRadius="4px"
                  w="100%"
                  h="30px"
                  padding={"10px"}
                  margin={"0"}
                  _placeholder={{ color: "#A0AEC0" }}
                />
                <Button
                  size="xs"
                  onClick={handleCreate}
                  isDisabled={createLocation.isPending}
                  variant="ghost"
                  _hover={{ bg: "none" }}
                  _active={{ bg: "none" }}
                >
                  {createLocation.isPending ? (
                    <Spinner size="xs" />
                  ) : (
                    <AddIcon />
                  )}
                </Button>
              </HStack>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      )}
      <FormErrorMessage>Required</FormErrorMessage>
    </FormControl>
  );
}
