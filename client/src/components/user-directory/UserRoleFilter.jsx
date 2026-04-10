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
        bg="#586771"
        color="#FFF"
        borderRadius="6px"
        px="16px"
        h="45px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        fontFamily="Inter"
        fontSize="16px"
        fontStyle="normal"
        fontWeight="600"
        lineHeight="24px"
        _hover={{ bg: "#4a5960" }}
        leftIcon={<FiFilter />}
        rightIcon={<ChevronDownIcon />}
      >
        Filter
      </MenuButton>
      <MenuList
        borderRadius="8.23px"
        bg="#FFF"
        boxShadow="0 2.743px 4.115px -0.686px rgba(0, 0, 0, 0.10), 0 1.372px 2.743px -0.686px rgba(0, 0, 0, 0.06)"
        border="none"
      >
        <MenuOptionGroup
          type="radio"
          value={selectedRole}
          onChange={onChange}
        >
          {roles.map((role) => (
            <MenuItemOption
              key={role.value}
              value={role.value}
              color="#000"
              fontFamily="Inter"
              fontSize="12.345px"
              fontStyle="normal"
              fontWeight="400"
              lineHeight="19.203px"
            >
              {role.label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
