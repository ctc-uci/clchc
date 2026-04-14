import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";

export default function CustomSelect({
  options,
  value,
  setValue,
  styleProps = {},
}) {
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Menu
      matchWidth
      strategy="fixed"
    >
      <MenuButton
        as={Button}
        w="100%"
        rightIcon={<ChevronDownIcon />}
        bg="white"
        borderWidth="1px"
        borderColor="gray.300"
        borderRadius="6px"
        fontWeight="normal"
        fontSize="14px"
        textAlign="left"
        color={selectedLabel ? "inherit" : "gray.400"}
        _hover={{ bg: "white", borderColor: "gray.400" }}
        _active={{ bg: "white" }}
        _expanded={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
        _disabled={{
          bg: "gray.50",
          color: "gray.500",
          opacity: 1,
          cursor: "not-allowed",
        }}
        {...styleProps} // In case we use this somewhere else
      >
        {selectedLabel || "Select option"}
      </MenuButton>

      <MenuList
        zIndex="popover"
        maxH="200px" // To prevent overflow, but scrolling might not be obvious -@grace
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
            >
              {opt.label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
