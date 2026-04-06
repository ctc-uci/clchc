import { useMemo, useState } from "react";

import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
} from "@chakra-ui/react";

import { PageHeader } from "@/components/common/PageHeader";
import { Navbar } from "@/components/layout/Navbar";
import {
  useDeleteUser,
  useUsers,
} from "@/contexts/hooks/data-fetching/useUsers";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";

import { UserPendingStatusList } from "./UserPendingStatusList";
import UserRoleFilter from "./UserRoleFilter";
import UserTable from "./UserTable";

export const UserDirectory = () => {
  const { role, loading: roleLoading } = useUserContext();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const navigate = useNavigate();

  const debouncedSetSearchQuery = useDebounce((value) => {
    setSearchQuery(value);
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSetSearchQuery(value);
  };

  const handleRoleChange = (value) => {
    setSelectedRole(
      Array.isArray(value) ? (value[0] ?? "all") : (value ?? "all")
    );
  };

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useUsers({ user: searchQuery, status: "approved" });

  const { mutate: deleteUser } = useDeleteUser();

  const handleDelete = (userId) => {
    deleteUser(userId);
  };

  const filteredUsers = useMemo(() => {
    const lowerQuery = (searchQuery || "").toLowerCase();

    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const email = (user.email || "").toLowerCase();

      const matchesSearch =
        !lowerQuery ||
        fullName.includes(lowerQuery) ||
        email.includes(lowerQuery);

      const matchesRole = selectedRole === "all" || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  return (
    <Box
      py={6}
      maxW="1200px"
      mx="auto"
    >
      <Flex
        justify="space-between"
        align="flex-start"
        mb={6}
      >
        <PageHeader
          title="User Directory"
          role={role}
          isLoading={roleLoading}
        />
      </Flex>

      <Flex
        align="center"
        gap={1}
        mb={2}
      >
        <Heading
          color="#00000080"
          fontSize="14px"
          fontWeight="medium"
        >
          PENDING REQUESTS
        </Heading>
      </Flex>
      <Box mb={4}>
        <UserPendingStatusList />
        <Flex
          justify="flex-end"
          mt={2}
        >
          <Box
            as="button"
            fontSize="14px"
            fontStyle="italic"
            color="gray.500"
            _hover={{ color: "gray.700" }}
            onClick={() => navigate("/user-requests")}
          >
          View All
          </Box>
        </Flex>
      </Box>
      <Flex
        gap={4}
        align="center"
        pb={6}
      >
        <InputGroup flex={1}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search Providers"
            borderRadius="10px"
            value={searchInput}
            onChange={handleSearchChange}
            fontWeight="normal"
            fontSize="sm"
            py={5}
            display="flex"
            //             display: flex;
            // width="1230px"
            // height: 44px;
            // justify-content: center;
            // align-items: center;
          />
        </InputGroup>

        <UserRoleFilter
          selectedRole={selectedRole}
          onChange={handleRoleChange}
        />
      </Flex>

      <UserTable
        users={filteredUsers}
        loading={isLoading}
        onDelete={handleDelete}
        onUpdated={refetch}
      />

      <Navbar />
    </Box>
  );
};
