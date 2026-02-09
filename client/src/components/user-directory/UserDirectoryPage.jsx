import { useContext, useEffect, useState, useMemo } from "react";

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
import debounce from "lodash.debounce";
import { useUsers, useUsersStats, useDeleteUser } from "@/contexts/hooks/data-fetching/useUsers";
import UserTable from "./UserTable";
import {UserPendingStatusList} from "./UserPendingStatusList";

export const UserDirectory = () => {
  const { backend } = useContext(BackendContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [ userId, setUserId ] = useState(null)
  const {
      data: users,
      isLoading,
      error,
      refetch,
  } = useUsers({ user: debouncedSearchQuery, status: "approved" });
  const {
    data: userStats = [],
    isStatsLoading,
    statsError,
    statsRefetch,
  } = useUsersStats();

  const {
      mutate: deleteUser,
      isLoading: isDeleting,
      error: deleteError,
    } = useDeleteUser();
  
  // table delete
  const handleDelete = async (userId) => {
    try {
      deleteUser(userId)
    } catch (err) {
      console.error(
        "couldn't delete user in components/UserDirectoryPage.jsx",
        err
      );
    }
  };

  const debouncedFetch = useMemo(() => {
      return debounce(() => {
        refetch();
      }, 300);
    }, [refetch]);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchQuery(searchQuery);
      }, 300);
  
      return () => clearTimeout(handler);
    }, [searchQuery]);
  
    useEffect(() => {
      if (!searchQuery) return; // no fetch if search is empty
  
      debouncedFetch();
  
      return () => {
        debouncedFetch.cancel();
      };
    }, [searchQuery, debouncedFetch]);
  
    const handleChange = (e) => {
      setSearchQuery(e.target.value);
    };

  if (isStatsLoading) {
    return <div> User stats loading... </div>
  }
  if (statsError) {
  return <div>Failed to load user stats</div>;
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
          onChange={handleChange}
        />
      </InputGroup>

      <UserTable
        users={users}
        loading ={isLoading}
        onDelete={handleDelete}
      />
      <Navbar />
    </Box>
  );
};
