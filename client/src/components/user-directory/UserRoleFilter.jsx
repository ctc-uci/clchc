import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";

import { FiFilter } from "react-icons/fi";

export default function UserRoleFilter({ selectedRole, onChange }) {
  const roles = [
    { label: "All Roles", value: "all" },
    { label: "Call Center Manager", value: "ccm" },
    { label: "Call Center Staff", value: "ccs" },
    { label: "Viewer", value: "viewer" },
  ];

  return (
    <Menu>
      <MenuButton
        as={Button}
        type="button"
        colorScheme="blackAlpha"
        leftIcon={<FiFilter />}
        rightIcon={<ChevronDownIcon />}
      >
        Filter
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          type="radio"
          value={selectedRole}
          onChange={onChange}
        >
          {roles.map((role) => (
            <MenuItemOption
              key={role.value}
              value={role.value}
            >
              {role.label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
