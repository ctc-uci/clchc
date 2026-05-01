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
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Skeleton,
  Text,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";

import {
  useLocations,
  useCreateLocation,
  useDeleteLocation,
} from "@/contexts/hooks/data-fetching/useLocations";

import { LockRightElement } from "../tools/shared";
import { MdDeleteOutline } from "react-icons/md";

export function LocationDropdown({ locationId, setLocationId, isLocked, isInvalid, onDifferentChange }) {
  const { data: { locations = [] } = {}, isLoading: loadingLocations } =
    useLocations();
  const { mutateAsync: createLocation} = useCreateLocation();
  const { mutateAsync: deleteLocation} = useDeleteLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
  const [isDeleteConfirmArmed, setIsDeleteConfirmArmed] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const toast = useToast();
  const selectedItemRef = useRef(null);

  const isDeletingLocations = pendingDeleteIds.length > 0;
  const isDifferent = pendingDeleteIds.length > 0 || (isAddingLocation && newValue.trim().length > 0);

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

  const handleCreate = async () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;

    const alreadyExists = locations.some(
      (l) => l.tagValue.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      toast({
        title: "Location already exists",
        status: "warning",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    try {
      const result = await createLocation({ tagValue: trimmed });
      const newLoc = Array.isArray(result) ? result[0] : result;
      if (newLoc?.id) {
        if (!locationId) {
          setLocationId(newLoc.id);
        }
        setNewValue("");
        setIsAddingLocation(false);
        return true;
      }
      return false;
    } catch (_err) {
      toast({
        title: "Error",
        description: "Failed to create location",
        status: "error",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  const handleDelete = (location) => (e) => {
    e.stopPropagation();
    if (pendingDeleteIds.includes(location.id)) {
      setPendingDeleteIds((prev) => prev.filter((id) => id !== location.id));
      setIsDeleteConfirmArmed(false);
      return;
    }
    e.stopPropagation();
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
        await deleteLocation({ id });
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

  const menuMaxHeight =
    pendingDeleteIds.length > 0 && isDeleteConfirmArmed ? "300px" : "240px";

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
            maxHeight={menuMaxHeight}
            overflow="hidden"
            minW="0"
            px="10px"
            py="2px"
          >
            <Box
              maxH="180px"
              overflowY="auto"
              sx={{
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
            <MenuOptionGroup
              title=""
              type="radio"
              value={locationId === "" ? "" : String(locationId)}
              onChange={(value) => setLocationId(Number(value))}
            >
              {/* Existing locations, minus staged deletes */}
              {locations.map((location) => (
                  <MenuItemOption
                    key={location.id}
                    value={String(location.id)}
                    ref={String(location.id) === String(locationId) ? selectedItemRef : null}
                    bg={pendingDeleteIds.includes(location.id) ? "#FFD2D2" : "white"}
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
                        <Icon as={MdDeleteOutline} boxSize="20px" />
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
                        void handleCreate();
                      }
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
                    isDisabled={isDeletingLocations}
                    autoFocus
                  />
                </HStack>
              ) : (
                <MenuItem
                  onClick={() => {
                    if (isLocked || isDeletingLocations) return;
                    setIsAddingLocation(true);
                  }}
                  isDisabled={isLocked || isDeletingLocations}
                  bg="white"
                  p="10px 14px 10px 32px"
                  fontSize="12px"
                  fontWeight="400"
                  borderRadius="4px"
                  my="6px"
                  opacity={isLocked || isDeletingLocations ? 0.4 : 1}
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
              <HStack py={1} gap="30px">
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
                  onClick={pendingDeleteIds.length > 0 ? handleDeleteAction : handleSave}
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
      )}

      <FormErrorMessage>Required</FormErrorMessage>

    </FormControl>
  );
}
