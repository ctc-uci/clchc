import { useContext, useEffect, useState } from "react";

import { InfoOutlineIcon, SearchIcon } from "@chakra-ui/icons";
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
import InputMask from "react-input-mask";

import UserTable from "./UserTable";

export const UserDirectory = () => {
  const { backend } = useContext(BackendContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // fetching users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await backend.get("/users-js");
        setUsers(data);
      } catch (err) {
        console.error(
          "couldn't fetch users in components/UserDirectoryPage.jsx",
          err
        );
      }
    };

    fetchUsers();
  }, [backend]);

  // table delete
  const handleDelete = async (id) => {
    try {
      await backend.delete(`/users-js/${id}`);
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
    return fullName.includes(lowerQuery) || email.includes(lowerQuery);
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

      <Box
        borderWidth="1px"
        borderColor="yellow.300"
        bg="yellow.50"
        borderRadius="lg"
        p={4}
        mb={8}
      >
        <Flex
          align="center"
          gap={2}
        >
          <InfoOutlineIcon></InfoOutlineIcon>
          <Text
            fontWeight="medium"
            color="gray.700"
          >
            Pending Requests
          </Text>
          <Badge
            borderRadius="full"
            px={1.5}
            py={0.3}
            colorScheme="red"
            variant="solid"
          >
            2
          </Badge>
        </Flex>
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
            body="5"
            height="12rem"
            width="14rem"
          />
          <CustomCard
            title="Managers"
            body="2"
            footer="hello"
            height="12rem"
            width="14rem"
          />
          <CustomCard
            title="Staff"
            body="2"
            height="12rem"
            width="14rem"
          />
          <CustomCard
            title="Viewers"
            body="1"
            height="12rem"
            width="14rem"
          />
        </HStack>
      </Box>

      <InputGroup
        maxW="400px"
        pb={6}
      >
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search by name or email..."
          borderRadius="md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      <UserTable
        users={filteredUsers}
        onDelete={handleDelete}
      />
      <Navbar />
    </Box>
  );
};
