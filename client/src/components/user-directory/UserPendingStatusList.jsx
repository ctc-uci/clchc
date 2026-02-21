import { useState } from "react";

import { WarningIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { BackendContext } from "@/contexts/BackendContext";
import {
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/contexts/hooks/data-fetching/useUsers";

import { DenyRequestModal } from "./DenyRequestModal";

export const UserPendingStatusList = () => {
  // const [pendingUsers, setPendingUsers] = useState([]);
  const {
    data: pendingUsers,
    isLoading,
    error,
  } = useUsers({ status: "pending" });
  const {
    mutate: updateUser,
    isLoading: isUpdating,
    error: errorUpdating,
  } = useUpdateUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  //When Approve Button is clicked, update user status to active
  const handleApprove = async (id) => {
    try {
      await updateUser({ id: id, data: { status: "approved" } });
    } catch (err) {
      console.error("Couldn't approve user", err);
    }
  };

  //When Deny Button is clicked, delete user from database
  const handleDeny = async (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    onClose();
  };

  if (isLoading) {
    return <Text> Loading pending users... </Text>;
  }

  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="0.5px solid #00000026"
      boxShadow="sm"
      p={4}
    >
      <VStack align="stretch">
        {pendingUsers.map((req) => (
          <Flex
            key={req.id}
            align="center"
            justify="space-between"
          >
            {/* Left */}
            <HStack
              spacing={3}
              ml={5}
              minW="260px"
            >
              <Flex
                w="58px"
                h="58px"
                bg="#F9FAFB"
                borderRadius="xl"
                align="center"
                justify="center"
                fontWeight="normal"
                fontSize="xl"
                color="black"
              >
                {`${req.firstName?.[0] ?? ""}${req.lastName?.[0] ?? ""}`}
              </Flex>
              <Box>
                <Text
                  fontSize="xl"
                  fontWeight="normal"
                >
                  {req.firstName} {req.lastName}
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="normal"
                  color="gray.500"
                >
                  {req.email}
                </Text>
              </Box>
            </HStack>

            <HStack spacing={5}>
              {/* Date */}
              <Text
                fontSize="sm"
                color="gray.500"
              >
                Request Date
              </Text>
              {/* Actions */}
              <Button
                size="sm"
                bg="blackAlpha.400"
                color="white"
                py={1}
                px={8}
                _hover={{ bg: "blackAlpha.500" }}
                onClick={() => handleDeny(req)}
              >
                Deny
              </Button>
              <Button
                size="sm"
                bg="blue.500"
                color="white"
                py={1}
                px={8}
                _hover={{ bg: "blue.600" }}
                onClick={() => handleApprove(req.id)}
              >
                Approve
              </Button>
            </HStack>
          </Flex>
        ))}
      </VStack>
      <DenyRequestModal
        isOpen={isOpen}
        onClose={onClose}
        user={selectedUser}
      />
    </Box>
  );
};
