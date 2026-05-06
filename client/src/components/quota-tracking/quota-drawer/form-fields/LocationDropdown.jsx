import { useEffect, useRef, useState } from "react";

import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  useToast,
} from "@chakra-ui/react";

import {
  useCreateLocation,
  useDeleteLocation,
} from "@/contexts/hooks/data-fetching/useLocations";
import { ChevronDown } from "lucide-react";
import { MdDeleteOutline } from "react-icons/md";

export function LocationDropdown({ locations = [], locationId, setLocationId, isLocked, isInvalid }) {
  const createLocation = useCreateLocation();
  const deleteLocation = useDeleteLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
  const [isDeleteConfirmArmed, setIsDeleteConfirmArmed] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const toast = useToast();
  const selectedItemRef = useRef(null);

  const isDeletingLocations = pendingDeleteIds.length > 0;
  const isDifferent =
    pendingDeleteIds.length > 0 ||
    (isAddingLocation && newValue.trim().length > 0);

  useEffect(() => {
    if (menuOpen) {
      setTimeout(() => {
        selectedItemRef.current?.scrollIntoView({ block: "nearest" });
      }, 0);
    }
  }, [menuOpen]);

  const selectedLocation = locations.find(
    (location) => String(location.id) === String(locationId)
  );

  const handleMenuOpen = () => {
    if (isLocked) return;
    setMenuOpen((prev) => {
      if (prev && isDifferent) return prev;
      if (!prev) {
        setPendingDeleteIds([]);
        setIsDeleteConfirmArmed(false);
        setIsAddingLocation(false);
        setNewValue("");
      }
      return !prev;
    });
  };

  const handleCreate = async (e) => {
    e?.stopPropagation();
    const trimmed = newValue.trim();
    if (!trimmed) return;

    try {
      const result = await createLocation.mutateAsync({ tagValue: trimmed });
      const newLocation = Array.isArray(result) ? result[0] : result;
      if (newLocation?.id) setLocationId(newLocation.id);
      setNewValue("");
      handleCancel();
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
    if (pendingDeleteIds.includes(location.id)) {
      setPendingDeleteIds((prev) => prev.filter((id) => id !== location.id));
      setIsDeleteConfirmArmed(false);
      return;
    }
    setPendingDeleteIds((prev) => [...prev, location.id]);
    setIsDeleteConfirmArmed(false);
    setIsAddingLocation(false);
    setNewValue("");
  };

  const handleDeleteAction = () => {
    if (!isDeleteConfirmArmed) {
      setIsDeleteConfirmArmed(true);
      return;
    }
    handleConfirm();
  };

  const handleSave = async () => {
    if (isAddingLocation && newValue.trim()) {
      await handleCreate();
      return;
    }
    handleConfirm();
  };

  const handleCancel = () => {
    setPendingDeleteIds([]);
    setMenuOpen(false);
    setIsDeleteConfirmArmed(false);
    setIsAddingLocation(false);
    setNewValue("");
  };

  const handleConfirm = async () => {
    try {
      for (const id of pendingDeleteIds) {
        await deleteLocation.mutateAsync({ id });
      }

      if (
        pendingDeleteIds.includes(Number(locationId)) ||
        pendingDeleteIds.includes(String(locationId))
      ) {
        setLocationId("");
      }

      setPendingDeleteIds([]);
      setMenuOpen(false);
      setIsDeleteConfirmArmed(false);
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
      isInvalid={isInvalid}
    >
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >
        Location
      </FormLabel>
        <Menu
          isOpen={menuOpen}
          onClose={() => {
            if (!isDifferent) setMenuOpen(false);
          }}
          closeOnBlur={!isDifferent}
          closeOnEsc={!isDifferent}
          closeOnSelect={false}
          matchWidth
        >
          <MenuButton
            as={Box}
            onClick={handleMenuOpen}
            w="100%"
            border={isInvalid ? "1px solid #FC8181" : "1px solid var(--gray-200, #E2E8F0)"}
            borderRadius="4px"
            bg="white"
            px={3}
            py={2}
            fontSize="14px"
            color={selectedLocation ? "var(--gray-700, #2D3748)" : "gray.400"}
            cursor="pointer"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <HStack
              justifyContent="space-between"
              w="100%"
            >
              <Text>{selectedLocation?.tagValue ?? "Select location"}</Text>
              {!isLocked && <ChevronDown size={20} />}
            </HStack>
          </MenuButton>

          <MenuList
            p={2}
            minW="0"
            w="100%"
            boxShadow="md"
            borderRadius="6px"
          >
            <Box
              maxH="180px"
              overflowY="auto"
              sx={{
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
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
                    ref={
                      String(location.id) === String(locationId)
                        ? selectedItemRef
                        : null
                    }
                    bg={
                      pendingDeleteIds.includes(location.id)
                        ? "#FFD2D2"
                        : "white"
                    }
                    px="10px"
                    py="4px"
                    fontSize="12px"
                    fontWeight="400"
                    borderRadius="4px"
                    my="6px"
                  >
                    <HStack
                      justifyContent="space-between"
                      w="100%"
                      spacing={2}
                    >
                      <Text
                        flex="1"
                        fontSize="12px"
                        fontWeight="400"
                      >
                        {location.tagValue}
                      </Text>
                      <Button
                        as="span"
                        variant="ghost"
                        aria-label={`Delete ${location.tagValue} location`}
                        ml="auto"
                        p={0}
                        minW={0}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onClick={handleDelete(location)}
                        _hover={{ bg: "transparent" }}
                        _active={{ bg: "transparent" }}
                      >
                        <Icon
                          as={MdDeleteOutline}
                          boxSize="20px"
                        />
                      </Button>
                    </HStack>
                  </MenuItemOption>
                ))}

                {isAddingLocation ? (
                  <HStack
                    px={3}
                    py={2}
                    gap={0}
                  >
                    <Input
                      placeholder="Enter location"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          void handleCreate(e);
                        }
                      }}
                      fontFamily="Inter"
                      fontStyle="normal"
                      lineHeight="20px"
                      fontSize="12px"
                      fontWeight="400"
                      color="black"
                      border="1px solid var(--gray-200, #E2E8F0)"
                      borderRadius="4px"
                      w="100%"
                      h="30px"
                      padding="10px"
                      margin="0"
                      _placeholder={{ color: "#A0AEC0" }}
                      isDisabled={isDeletingLocations}
                      autoFocus
                    />
                  </HStack>
                ) : (
                  <MenuItem
                    onClick={() => {
                      if (isDeletingLocations) return;
                      setIsAddingLocation(true);
                    }}
                    isDisabled={isDeletingLocations}
                    bg="white"
                    p="10px 14px 10px 32px"
                    fontSize="12px"
                    fontWeight="400"
                    borderRadius="4px"
                    my="6px"
                    opacity={isDeletingLocations ? 0.4 : 1}
                  >
                    <HStack
                      justifyContent="space-between"
                      w="100%"
                      spacing={2}
                    >
                      <Text>Add Location</Text>
                      <AddIcon />
                    </HStack>
                  </MenuItem>
                )}
              </MenuOptionGroup>
            </Box>

            <HStack
              pt={2}
              px={0}
              pb={1}
              gap={1}
              flexDirection="column"
              alignItems="stretch"
            >
              {pendingDeleteIds.length > 0 && isDeleteConfirmArmed && (
                <Text
                  color="red.500"
                  fontSize="10px"
                  lineHeight="1.1"
                >
                  Are you sure? This is going to be deleted for all quotas.
                </Text>
              )}
              <HStack
                py={1}
                gap="30px"
              >
                <Button
                  width="55px"
                  height="24px"
                  fontSize="12px"
                  fontWeight="600"
                  variant="ghost"
                  onClick={handleCancel}
                  flex={1}
                  border="1px solid var(--gray-200, #E2E8F0)"
                  borderRadius="4px"
                  padding="0 8px"
                >
                  Cancel
                </Button>
                <Button
                  width="55px"
                  height="24px"
                  fontSize="12px"
                  fontWeight="600"
                  onClick={
                    pendingDeleteIds.length > 0
                      ? handleDeleteAction
                      : handleSave
                  }
                  isDisabled={!isDifferent}
                  opacity={isDifferent ? 1 : 0.4}
                  bg={pendingDeleteIds.length > 0 ? "#63171B" : "#3182CE"}
                  color="white"
                  flex={1}
                  borderRadius="4px"
                  padding="0 8px"
                >
                  {pendingDeleteIds.length > 0
                    ? isDeleteConfirmArmed
                      ? "Confirm"
                      : "Delete"
                    : "Save"}
                </Button>
              </HStack>
            </HStack>
          </MenuList>
        </Menu>

      <FormErrorMessage>Required</FormErrorMessage>
    </FormControl>
  );
}
