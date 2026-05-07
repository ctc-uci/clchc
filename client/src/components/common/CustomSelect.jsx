import { useRef, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({
  options,
  value,
  setValue,
  isSearchable = false,
  isReadOnly = false,
  placeholder = "Select option",
  styleProps = {},
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const containerRef = useRef(null);

  const debouncedSetSearch = useDebounce((val) => setDebouncedSearch(val), 250); // a little bit slow... idk

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const handleClose = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    onClose();
  };

  useOutsideClick({ ref: containerRef, handler: handleClose });

  const filteredOptions =
    isSearchable && debouncedSearch
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      : options;

  const handleSelect = (optValue) => {
    setValue(optValue);
    handleClose();
  };

  if (isSearchable) {
    return (
      <Box
        ref={containerRef}
        position="relative"
      >
        <InputGroup>
          <Input
            value={isOpen ? searchQuery : (selectedLabel ?? "")}
            onChange={(e) => { setSearchQuery(e.target.value); debouncedSetSearch(e.target.value); }}
            onFocus={() => { if (isReadOnly) return; setSearchQuery(""); onOpen(); }}
            onClick={() => { if (isReadOnly || isOpen) return; setSearchQuery(""); onOpen(); }}
            placeholder={placeholder}
            autoComplete="off"
            cursor={isOpen ? "text" : "pointer"}
            readOnly={!isOpen}
            fontFamily="Inter"
            fontSize="14px"
            fontWeight="400"
            color={selectedLabel || isOpen ? "var(--gray-700, #2D3748)" : "gray.400"}
            borderRadius="4px"
            border="1px solid var(--gray-200, #E2E8F0)"
            background="var(--white, #FFF)"
            _focus={{ boxShadow: "none", borderColor: "inherit" }}
            pr="2.5rem"
            {...styleProps}
          />
          {!isReadOnly && (
            <InputRightElement
              pointerEvents="none"
              color="gray.500"
            >
              <ChevronDown size={20} />
            </InputRightElement>
          )}
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
              {filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <HStack
                    key={opt.value}
                    px={3}
                    py={2}
                    justify="space-between"
                    cursor="pointer"
                    bg={isSelected ? "blue.50" : "white"}
                    _hover={{ bg: isSelected ? "blue.50" : "gray.50" }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(opt.value)}
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
                        {opt.label}
                      </Text>
                    </HStack>
                  </HStack>
                );
              })}
              {filteredOptions.length === 0 && (
                <Text
                  px={3}
                  py={2}
                  fontSize="12px"
                  color="gray.400"
                >
                  No options found
                </Text>
              )}
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box pointerEvents={isReadOnly ? "none" : undefined}>
    <Menu matchWidth>
      <MenuButton
        as={Button}
        variant="outline"
        w="100%"
        rightIcon={isReadOnly ? undefined : <ChevronDown size={20} />}
        justifyContent="flex-start"
        textAlign="left"
        color={selectedLabel ? "var(--gray-700, #2D3748)" : "gray.400"}
        fontFamily="Inter"
        fontSize="14px"
        fontWeight="400"
        fontStyle="normal"
        lineHeight="20px"
        borderRadius="4px"
        border="1px solid var(--gray-200, #E2E8F0)"
        background="var(--white, #FFF)"
        _disabled={{
          bg: "gray.50",
          color: "gray.500",
          opacity: 1,
          cursor: "not-allowed",
        }}
        {...styleProps}
      >
        {selectedLabel || placeholder}
      </MenuButton>

      <MenuList
        zIndex="popover"
        w="100%"
        minW="0"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        boxShadow="sm"
        overflow="hidden"
      >
        <Box
          maxHeight="180px"
          overflowY="auto"
        >
          <MenuOptionGroup
            type="radio"
            value={value}
            onChange={(newVal) => setValue(newVal)}
          >
            {options.map((opt) => (
              <MenuItemOption
                key={opt.value}
                value={opt.value}
                px={3}
                py={2}
                fontSize="12px"
                fontWeight="400"
                _checked={{ bg: "blue.50", color: "blue.600" }}
                _hover={{ bg: "gray.50" }}
                _focus={{ bg: "gray.50" }}
              >
                {opt.label}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </Box>
      </MenuList>
    </Menu>
    </Box>
  );
}
