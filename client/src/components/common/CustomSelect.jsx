import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({
  options,
  value,
  setValue,
  styleProps = {},
}) {
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Menu matchWidth>
      <MenuButton
        as={Button}
        variant="outline"
        w="100%"
        rightIcon={<ChevronDown size={20} />}
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
        {selectedLabel || "Select option"}
      </MenuButton>

      <MenuList
        zIndex="popover"
        maxHeight="240px" // To prevent overflow, but scrolling might not be obvious -@grace
        overflowY="auto"
        w="100%"
        minW="0"
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
