import { useContext, useEffect, useState } from "react";

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
import { BackendContext } from "@/contexts/BackendContext";

import { UserPendingStatusList } from "./UserPendingStatusList";
import UserRoleFilter from "./UserRoleFilter";
import UserTable from "./UserTable";

export const UserDirectory = () => {
  const { backend } = useContext(BackendContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userStats, setUserStats] = useState({});
  const [selectedRole, setSelectedRole] = useState("all");

  // Keep filter in state so changing role doesn't refresh the page (client-side only)
  const handleRoleChange = (value) => {
    setSelectedRole(Array.isArray(value) ? value[0] ?? "all" : value ?? "all");
  };

  useEffect(() => {
    // Fetches users and user stats in parallel
    const fetchUserInfo = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          backend.get("/users"),
          backend.get("/users/stats"),
        ]);

        setUsers(usersRes.data);
        setUserStats(statsRes.data);
      } catch (err) {
        console.error(
          "couldn't fetch user info in components/UserDirectoryPage.jsx",
          err
        );
      }
    };

    fetchUserInfo();
  }, [backend]);

  // table delete
  const handleDelete = async (id) => {
    try {
      await backend.delete(`/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      console.error(
        "couldn't delete user in components/UserDirectoryPage.jsx",
        err
      );
    }
  };

  // filter data via search bar changes
  const filteredUsers = users.filter((user) => {
    const lowerQuery = searchQuery.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();

    const matchesSearch =
      fullName.includes(lowerQuery) || email.includes(lowerQuery);

    const matchesRole =
      selectedRole === "all" || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

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
              onChange={(e) => console.log("date input:", e.target.value)}
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
            placeholder="Search Providers"
            borderRadius="md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <UserRoleFilter
          selectedRole={selectedRole}
          onChange={handleRoleChange}
        />
      </Flex>

      <UserTable
        users={filteredUsers}
        onDelete={handleDelete}
      />
      <Navbar />
    </Box>
  );
};
