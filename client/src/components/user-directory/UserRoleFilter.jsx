import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";

import { FiFilter } from "react-icons/fi";

export default function UserRoleFilter({ selectedRoles, onChange }) {
  const roles = [
    "All Roles",
    "Call Center Manager",
    "Call Center Staff",
    "Viewer",
  ];

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        colorScheme="blackAlpha"
        leftIcon={<FiFilter />}
        rightIcon={<ChevronDownIcon />}
      >
        Filter
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          type="checkbox"
          value={selectedRoles}
          onChange={onChange}
        >
          {roles.map((role) => (
            <MenuItemOption
              key={role}
              value={role}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
