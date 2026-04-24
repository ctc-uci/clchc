import { useRef, useState } from "react";

import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
  useOutsideClick,
  useToast,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import { MdDeleteOutline } from "react-icons/md";

import { useDeleteLocation } from "@/contexts/hooks/data-fetching/useLocations";
import { useDebounce } from "@/hooks/useDebounce";
import { LockRightElement } from "../tools/shared";

export function LocationDropdown({ locations = [], locationId, setLocationId, isLocked, isInvalid }) {
  const deleteLocation = useDeleteLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deletingMap, setDeletingMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const toast = useToast();
  const containerRef = useRef(null);

  const debouncedSetSearch = useDebounce((val) => setDebouncedSearch(val), 300);

  const handleClose = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    onClose();
  };

  useOutsideClick({ ref: containerRef, handler: handleClose });

  const selectedLocation = locations.find(
    (location) => String(location.id) === String(locationId)
  );

  const filteredLocations = locations.filter((l) =>
    l.tagValue.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    debouncedSetSearch(val);
  };

  const handleSelect = (id) => {
    setLocationId(id);
    handleClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredLocations.length > 0) {
      e.preventDefault();
      handleSelect(filteredLocations[0].id);
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
        <Box
          ref={containerRef}
          position="relative"
        >
          <InputGroup>
            <Input
              value={isOpen ? searchQuery : (selectedLocation?.tagValue ?? "")}
              onChange={handleInputChange}
              onFocus={() => { setSearchQuery(""); setDebouncedSearch(""); onOpen(); }}
              onKeyDown={handleKeyDown}
              placeholder="Select location"
              autoComplete="off"
              cursor={isOpen ? "text" : "pointer"}
              readOnly={!isOpen}
              fontFamily="Inter"
              fontSize="14px"
              fontWeight="400"
              color={selectedLocation || isOpen ? "var(--gray-700, #2D3748)" : "gray.400"}
              borderRadius="4px"
              border={isInvalid ? "1px solid #FC8181" : "1px solid var(--gray-200, #E2E8F0)"}
              background="var(--white, #FFF)"
              _focus={{ boxShadow: "none", borderColor: "inherit" }}
              pr="2.5rem"
            />
            <InputRightElement pointerEvents="none" color="gray.500">
              <ChevronDown size={20} />
            </InputRightElement>
          </InputGroup>

          {isOpen && (
            <Box
              position="absolute"
              top="calc(100% + 4px)"
              left="0"
              right="0"
              zIndex="popover"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="sm"
              overflow="hidden"
            >
              <Box
                overflowY="auto"
                maxH="180px"
              >
                {filteredLocations.map((location) => {
                  const isSelected = String(location.id) === String(locationId);
                  return (
                    <HStack
                      key={location.id}
                      px={3}
                      py={2}
                      justify="space-between"
                      cursor="pointer"
                      bg={isSelected ? "blue.50" : "white"}
                      _hover={{ bg: isSelected ? "blue.50" : "gray.50" }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(location.id)}
                    >
                      <HStack
                        flex="1"
                        gap={2}
                        minW="0"
                      >
                        {isSelected && (
                          <CheckIcon
                            boxSize={3}
                            color="blue.500"
                            flexShrink={0}
                          />
                        )}
                        <Text
                          fontSize="12px"
                          fontWeight="400"
                          color={isSelected ? "blue.600" : "inherit"}
                          noOfLines={1}
                        >
                          {location.tagValue}
                        </Text>
                      </HStack>
                      <Button
                        variant="ghost"
                        size="xs"
                        flexShrink={0}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(location)(e);
                        }}
                        isLoading={!!deletingMap[location.id]}
                      >
                        <MdDeleteOutline size={20} />
                      </Button>
                    </HStack>
                  );
                })}
                {filteredLocations.length === 0 && (
                  <Text
                    px={3}
                    py={2}
                    fontSize="12px"
                    color="gray.400"
                  >
                    No locations found
                  </Text>
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
      <FormErrorMessage>Required</FormErrorMessage>
    </FormControl>
  );
}
