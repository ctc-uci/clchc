import { useState } from "react";

import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useUsers } from "@/contexts/hooks/data-fetching/useUsers";
import { useDebounce } from "@/hooks/useDebounce";

const ROLE_LABELS = {
  viewer: "Viewer",
  ccm: "CCM",
  ccs: "CCS",
  master: "Master",
};

const ROLE_COLORS = {
  ccm: "#07B8AC",
  ccs: "#35639D",
};

export default function StepSelectUser({ onClose, onSelect, onNext }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: users = [], isLoading } = useUsers({
    user: searchQuery,
    status: "approved",
  });
  const qualifiedUsers = users.filter(
    (user) => user.role === "ccs" || user.role === "ccm"
  );
  const [selectedUser, setSelectedUser] = useState(null);

  const debouncedSetSearchQuery = useDebounce((value) => {
    setSearchQuery(value);
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSetSearchQuery(value);
  };

  return (
    <>
      <VStack
        alignItems="flex-start"
        w="100%"
        gap="10px"
      >
        <Text
          fontSize="14px"
          fontWeight="400"
        >
          Step 1: Select a New Master
        </Text>
        <Text
          fontSize="14px"
          fontWeight="400"
          color="gray.600"
        >
          Choose or search for a CCM or Staff member to recieve Master
          privileges. Viewers are not eligible.
        </Text>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            display="flex"
            alignItems="center"
            h="100%"
          >
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            bg="white"
            placeholder="Search Users"
            borderRadius="10px"
            h="45px"
            value={searchInput}
            onChange={handleSearchChange}
          />
        </InputGroup>

        {isLoading ? (
          <>
            <Skeleton
              height="60px"
              width="100%"
            ></Skeleton>
            <Skeleton
              height="60px"
              width="100%"
            ></Skeleton>
            <Skeleton
              height="60px"
              width="100%"
            ></Skeleton>
            <Skeleton
              height="60px"
              width="100%"
            ></Skeleton>{" "}
          </>
        ) : (
          <Grid
            templateColumns="1fr 1fr"
            w="100%"
            mx="auto"
            rowGap="20px"
            columnGap="20px"
          >
            {" "}
            {qualifiedUsers.map((user) => (
              <GridItem key={user.id}>
                <Box
                  bg={user.firebaseUid === selectedUser ? "#E7E7E7" : "#F7F7F7"}
                  border="1px solid #E5E5E5"
                  borderRadius="8px"
                  px={4}
                  py={3}
                  w="100%"
                  minH="60px"
                  onClick={() => {
                    setSelectedUser(user.firebaseUid);
                    onSelect(user.firebaseUid);
                  }}
                >
                  <Flex
                    align="center"
                    gap={3}
                  >
                    <Avatar
                      name={`${user?.firstName} ${user?.lastName}`}
                      src={user?.photoURL}
                      size="sm"
                      bg="#FFF"
                      color="black"
                      borderRadius="10px"
                      w="36px"
                      h="36px"
                      fontSize="14px"
                    />

                    <Box flex={1}>
                      <Text
                        fontWeight="600"
                        fontSize="14px"
                      >
                        {user?.firstName} {user?.lastName}
                      </Text>
                      <Text
                        fontSize="12px"
                        color="gray.500"
                      >
                        {user?.email}
                      </Text>
                    </Box>

                    <Tag
                      border="1px solid #D1D5DB"
                      borderRadius="6px"
                      px={2}
                      py="2px"
                      fontSize="12px"
                      color="white"
                      bg={ROLE_COLORS[user?.role] || "#F5F5F5"}
                    >
                      {ROLE_LABELS[user?.role] || user?.role}
                    </Tag>
                  </Flex>
                </Box>
              </GridItem>
            ))}
          </Grid>
        )}
      </VStack>
      <HStack
        justifyContent="flex-end"
        gap="10px"
        mt="30px"
      >
        <Button
          onClick={onClose}
          minW="155px"
          height="48px"
          paddingX="24px"
          justifyContent="center"
          display="flex"
          bg="white"
          border="0.5px solid #D9D9D9"
        >
          Cancel
        </Button>
        <Button
          onClick={onNext}
          minW="155px"
          height="48px"
          paddingX="24px"
          justifyContent="center"
          display="flex"
          bg="#113D64"
          color="white"
          border="0.5px solid #D9D9D9"
          isDisabled={!selectedUser}
        >
          Next
        </Button>
      </HStack>
    </>
  );
}
