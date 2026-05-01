import { useRef, useState } from "react";

import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
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

import { useDebounce } from "@/hooks/useDebounce";
import { LockRightElement } from "../tools/shared";

export function ProviderDropdown({ providers = [], providerId, setProviderId, isLocked, isInvalid }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const selectedProvider = providers.find(
    (provider) => String(provider.id) === String(providerId)
  );

  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    debouncedSetSearch(val);
  };

  const handleSelect = (id) => {
    setProviderId(id);
    handleClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredProviders.length > 0) {
      e.preventDefault();
      handleSelect(filteredProviders[0].id);
    }
  };

  return (
    <FormControl
      isRequired
      isDisabled={isLocked}
      isInvalid={isInvalid}
    >
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >
        Provider
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
            pr="2.25rem"
            bg="gray.50"
            color="gray.500"
          >
            {selectedProvider?.name ?? ""}
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
              value={isOpen ? searchQuery : (selectedProvider?.name ?? "")}
              onChange={handleInputChange}
              onFocus={() => { setSearchQuery(""); setDebouncedSearch(""); onOpen(); }}
              onKeyDown={handleKeyDown}
              placeholder="Select provider"
              autoComplete="off"
              cursor={isOpen ? "text" : "pointer"}
              readOnly={!isOpen}
              fontFamily="Inter"
              fontSize="14px"
              fontWeight="400"
              color={selectedProvider || isOpen ? "var(--gray-700, #2D3748)" : "gray.400"}
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
                {filteredProviders.map((provider) => {
                  const isSelected = String(provider.id) === String(providerId);
                  return (
                    <HStack
                      key={provider.id}
                      px={3}
                      py={2}
                      justify="space-between"
                      cursor="pointer"
                      bg={isSelected ? "blue.50" : "white"}
                      _hover={{ bg: isSelected ? "blue.50" : "gray.50" }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(provider.id)}
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
                          {provider.name}
                        </Text>
                      </HStack>
                    </HStack>
                  );
                })}
                {filteredProviders.length === 0 && (
                  <Text
                    px={3}
                    py={2}
                    fontSize="12px"
                    color="gray.400"
                  >
                    No providers found
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
