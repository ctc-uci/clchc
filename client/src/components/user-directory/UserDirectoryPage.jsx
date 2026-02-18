import { useMemo, useState } from "react";

import { SearchIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";

import { CustomCard } from "@/components/common/CustomCard";
import { Navbar } from "@/components/layout/Navbar";
import {
  useDeleteUser,
  useUsers,
  useUsersStats,
} from "@/contexts/hooks/data-fetching/useUsers";
import { useDebounce } from "@/hooks/useDebounce";

import { UserPendingStatusList } from "./UserPendingStatusList";
import UserRoleFilter from "./UserRoleFilter";
import UserTable from "./UserTable";

export const UserDirectory = () => {
  // Keep what's typed immediately (so the input feels responsive)
  const [searchInput, setSearchInput] = useState("");
  // This is what we actually query/filter with (debounced updates)
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedRole, setSelectedRole] = useState("all");

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
    error,
    refetch,
  } = useUsers({ user: searchQuery, status: "approved" });

  const {
    data: userStats = {},
    isLoading: isStatsLoading,
    error: statsError,
  } = useUsersStats();

  const { mutate: deleteUser } = useDeleteUser();

  const handleDelete = (userId) => {
    deleteUser(userId);
  };

  // Client-side role filter + (extra) client-side search filter for safety
  // (even if backend already searches, this keeps UI consistent)
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

  if (isStatsLoading) {
    return <Text>User stats loading...</Text>;
  }

  return (
    <Box
      p={6}
      maxW="1200px"
      mx="auto"
    >
      <Flex
        justify="space-between"
        align="flex-start"
        mb={6}
      >
        <Box>
          <Flex
            align="flex-end"
            gap={2}
          >
            <Heading size="lg">User Directory</Heading>
            <Badge
              colorScheme="yellow"
              borderRadius="full"
              px={2}
              py={0.5}
              fontSize="xs"
            >
              Master
            </Badge>
          </Flex>
          <Text
            color="gray.500"
            mt={1}
          >
            Manage user accounts and permissions
          </Text>
        </Box>

        <Box
          flex="1"
          display="flex"
          justifyContent="flex-end"
        >
          <InputGroup w="19ch">
            <Input
              textAlign="center"
              type="date"
            />
          </InputGroup>
        </Box>
      </Flex>

      <Box mb={8}>
        <UserPendingStatusList />
      </Box>

      <Heading
        size="sm"
        mb={0}
        color="gray.600"
      >
        User Statistics
      </Heading>

      <Box
        overflowX="auto"
        py={4}
        mb={6}
      >
        <HStack
          spacing={4}
          minW="min-content"
        >
          <CustomCard
            title="Total Users"
            body={userStats.total}
            height="12rem"
            width="14rem"
          />
          {userStats.byRole &&
            userStats.byRole.map((userStat) => (
              <CustomCard
                key={userStat.role}
                title={userStat.role}
                body={userStat.count}
                height="12rem"
                width="14rem"
              />
            ))}
        </HStack>
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
            placeholder="Search by name or email..."
            borderRadius="md"
            value={searchInput}
            onChange={handleSearchChange}
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
