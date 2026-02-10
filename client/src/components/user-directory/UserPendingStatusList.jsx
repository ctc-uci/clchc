import { useContext, useEffect, useState } from "react";

import { WarningIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { BackendContext } from "@/contexts/BackendContext";

export const UserPendingStatusList = () => {
  const { backend } = useContext(BackendContext);
  const [pendingUsers, setPendingUsers] = useState([]);

  //Fetch users and check for pending status
  useEffect(() => {
    const checkPendingStatus = async () => {
      try {
        // Fetch all users that have pending status
        const response = await backend.get("/users", {
          params: { status: "pending" },
        });
        setPendingUsers(response.data);
      } catch (err) {
        console.error(
          "couldn't fetch pending status in components/UserPendingStatus.jsx",
          err
        );
      }
    };

    checkPendingStatus();
  }, [backend]);

  //When Approve Button is clicked, update user status to active
  const handleApprove = async (id) => {
    try {
      await backend.put(`/users/${id}`, {
        status: "approved",
      });

      setPendingUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Couldn't approve user", err);
    }
  };

  //When Deny Button is clicked, delete user from database
  const handleDeny = async (id) => {
    try {
      await backend.delete(`/users/${id}`);
      setPendingUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error(
        "couldn't deny user in components/UserPendingStatus.jsx",
        err
      );
    }
  };

  return (
    <Box
      bg="#FFF8E6"
      borderRadius="lg"
      p={6}
      border="1px solid"
      borderColor="yellow.200"
    >
      <Flex
        align="center"
        mb={4}
      >
        <WarningIcon
          color="orange.400"
          mr={2}
        />
        <Text fontWeight="semibold">Pending Requests</Text>
        <Badge
          ml={2}
          colorScheme="red"
          borderRadius="full"
          px={2}
        >
          {pendingUsers.length}
        </Badge>
      </Flex>

      <VStack
        spacing={3}
        align="stretch"
      >
        {pendingUsers.map((req) => (
          <Flex
            key={req.id}
            bg="white"
            p={4}
            borderRadius="md"
            align="center"
            justify="space-between"
            boxShadow="sm"
          >
            {/* Placeholder Icon */}
            <WarningIcon />
            {/* Left */}
            <HStack
              spacing={3}
              minW="260px"
            >
              <Avatar size="sm" />
              <Box>
                <Text fontWeight="medium">
                  {req.firstName} {req.lastName}
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.500"
                >
                  {req.email}
                </Text>
              </Box>
            </HStack>

            {/* Date */}
            <Text
              fontSize="sm"
              color="gray.500"
            >
              Request Date
            </Text>

            {/* Role */}
            <Text fontSize="sm">{req.role}</Text>

            {/* Actions */}
            <HStack spacing={2}>
              <Button
                size="sm"
                colorScheme="blackAlpha"
                onClick={() => handleApprove(req.id)}
              >
                ✓ Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeny(req.id)}
              >
                ✕ Deny
              </Button>
            </HStack>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};
