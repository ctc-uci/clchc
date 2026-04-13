import { useEffect, useRef, useState } from "react";

import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
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

import { LockRightElement } from "../tools/shared";
import { MdDeleteOutline } from "react-icons/md";

export function LocationDropdown({ locationId, setLocationId, isLocked }) {
  const { data: { locations = [] } = {}, isLoading: loadingLocations } =
    useLocations();
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

  if (loadingLocations) {
    return (
      <FormControl w="50%">
        <Skeleton
          height="16px"
          mb={2}
        />
        <Skeleton
          height="40px"
          borderRadius="6px"
        />
      </FormControl>
    );
  }

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
    if (String(id) === String(locationId)) setLocationId("");

    deleteLocation.mutate(
      { id },
      {
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
            border={"1px solid var(--gray-200, #E2E8F0)"}
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
                  pl="2"
                >
                  <HStack
                    justifyContent="space-between"
                    w="100%"
                  >
                    <Text w="106px" h="fit-content" fontSize="12px" fontWeight="400">{location.tagValue}</Text>
                    <Button
                      as="span"
                      variant="ghost"
                      onClick={handleDelete(location)}
                      isLoading={!!deletingMap[location.id]}
                    >
                      <MdDeleteOutline size={20} color="" />
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
                  placeholder="New location"
                  size="sm"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
                <Button
                  size="xs"
                  onClick={handleCreate}
                  isDisabled={createLocation.isPending}
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
    </FormControl>
  );
}
