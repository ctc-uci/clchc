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
  ListItem,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  UnorderedList,
  VStack,
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

export function LocationDropdown({ locationId, setLocationId, isLocked, isInvalid, onDifferentChange }) {
  const { data: { locations = [] } = {}, isLoading: loadingLocations } =
    useLocations();
  const createLocation = useCreateLocation();
  const deleteLocation = useDeleteLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [pendingNewLocations, setPendingNewLocations] = useState([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const toast = useToast();
  const selectedItemRef = useRef(null);

  const isDifferent = pendingNewLocations.length > 0 || pendingDeleteIds.length > 0;

  useEffect(() => {
    if (menuOpen) {
      setTimeout(() => {
        selectedItemRef.current?.scrollIntoView({ block: "nearest" });
      }, 0);
    }
  }, [menuOpen]);

useEffect(() => {
    if (typeof onDifferentChange === "function") {
      onDifferentChange(isDifferent);
    }
  }, [isDifferent, onDifferentChange]);

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

  const handleMenuOpen = () => {
    setPendingNewLocations([]);
    setPendingDeleteIds([]);
    setMenuOpen(true);
  };

  const handleCreate = (e) => {
    if (e?.stopPropagation) e.stopPropagation();
    const trimmed = newValue.trim();
    if (!trimmed) return;

    const alreadyExists = locations.some(
      (l) => l.tagValue.toLowerCase() === trimmed.toLowerCase()
    );
    const alreadyPending = pendingNewLocations.some(
      (l) => l.tagValue.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists || alreadyPending) {
      toast({
        title: "Location already exists",
        status: "warning",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setPendingNewLocations((prev) => [
      ...prev,
      { tempId: `loc-temp-${Date.now()}`, tagValue: trimmed },
    ]);
    setNewValue("");
  };

  const handleDelete = (location) => (e) => {
    e.stopPropagation();
    setPendingDeleteIds((prev) => [...prev, location.id]);
  };

  const handleSave = () => setIsConfirmOpen(true);

  const handleCancel = () => {
    setPendingNewLocations([]);
    setPendingDeleteIds([]);
    setMenuOpen(false);
  };

  const handleConfirm = async () => {
    setIsConfirmOpen(false);
    try {
      let lastCreatedId = null;
      for (const { tagValue } of pendingNewLocations) {
        const result = await createLocation.mutateAsync({ tagValue });
        const newLoc = Array.isArray(result) ? result[0] : result;
        if (newLoc?.id) lastCreatedId = newLoc.id;
      }

      for (const id of pendingDeleteIds) {
        await deleteLocation.mutateAsync({ id });
      }

      if (lastCreatedId && !locationId) {
        setLocationId(lastCreatedId);
      }

      if (
        pendingDeleteIds.includes(Number(locationId)) ||
        pendingDeleteIds.includes(String(locationId))
      ) {
        setLocationId("");
      }

      setPendingNewLocations([]);
      setPendingDeleteIds([]);
      setMenuOpen(false);
    } catch (_err) {
      toast({
        title: "Error",
        description: "Failed to save location changes",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
    }
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
          isOpen={menuOpen}
          onOpen={handleMenuOpen}
          onClose={() => { if (!isDifferent) setMenuOpen(false); }}
          closeOnBlur={!isDifferent}
          closeOnEsc={!isDifferent}
          closeOnSelect={false}
          matchWidth
        >
          <MenuButton
            onClick={handleMenuOpen}
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
              {/* Existing locations, minus staged deletes */}
              {locations
                .filter((l) => !pendingDeleteIds.includes(l.id))
                .map((location) => (
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
                      >
                        <MdDeleteOutline size={20} />
                      </Button>
                    </HStack>
                  </MenuItemOption>
                ))}

              {/* Pending new locations — staged locally, not yet in DB */}
              {pendingNewLocations.map(({ tempId, tagValue }) => (
                <HStack
                  key={tempId}
                  pl={9}
                  pr={0}
                  py={2}
                  justifyContent="space-between"
                  w="100%"
                  opacity={0.7}
                  cursor="default"
                >
                  <Text flex="1" fontSize="12px" fontWeight="400" fontStyle="italic">
                    {tagValue}
                  </Text>
                  <Button
                    as="span"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingNewLocations((prev) =>
                        prev.filter((l) => l.tempId !== tempId)
                      );
                    }}
                  >
                    <MdDeleteOutline size={20} />
                  </Button>
                </HStack>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate(e);
                  }}
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
                  variant="ghost"
                  _hover={{ bg: "none" }}
                  _active={{ bg: "none" }}
                >
                  <AddIcon />
                </Button>
              </HStack>
            </MenuOptionGroup>

            <HStack
              px={3}
              py={2}
              gap={2}
              borderTop="1px solid"
              borderColor="gray.200"
            >
              <Button
                size="xs"
                variant="ghost"
                onClick={handleCancel}
                flex={1}
                borderRadius="6px"
              >
                Cancel
              </Button>
              <Button
                size="xs"
                onClick={handleSave}
                isDisabled={!isDifferent}
                opacity={isDifferent ? 1 : 0.4}
                colorScheme="blue"
                flex={1}
                borderRadius="6px"
              >
                Save
              </Button>
            </HStack>
          </MenuList>
        </Menu>
      )}
      <FormErrorMessage>Required</FormErrorMessage>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="16px">Confirm location changes</ModalHeader>
          <ModalBody>
            <VStack align="stretch" spacing={3}>
              {pendingNewLocations.length > 0 && (
                <VStack align="stretch" spacing={1}>
                  <Text fontWeight="600" fontSize="14px">
                    Creating {pendingNewLocations.length} location
                    {pendingNewLocations.length > 1 ? "s" : ""}:
                  </Text>
                  <UnorderedList pl={4}>
                    {pendingNewLocations.map(({ tempId, tagValue }) => (
                      <ListItem key={tempId} fontSize="14px">{tagValue}</ListItem>
                    ))}
                  </UnorderedList>
                </VStack>
              )}
              {pendingDeleteIds.length > 0 && (
                <VStack align="stretch" spacing={1}>
                  <Text fontWeight="600" fontSize="14px">
                    Deleting {pendingDeleteIds.length} location
                    {pendingDeleteIds.length > 1 ? "s" : ""}:
                  </Text>
                  <UnorderedList pl={4}>
                    {pendingDeleteIds.map((id) => {
                      const loc = locations.find((l) => l.id === id);
                      return (
                        <ListItem key={id} fontSize="14px">
                          {loc?.tagValue ?? id}
                        </ListItem>
                      );
                    })}
                  </UnorderedList>
                </VStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button variant="ghost" size="sm" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" size="sm" onClick={handleConfirm}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormControl>
  );
}
