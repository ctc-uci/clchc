import { WarningIcon } from "@chakra-ui/icons";
import { useState } from "react";

import {
  Box,
  Button,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import {
  useUpdateUser,
  useUsers,
} from "@/contexts/hooks/data-fetching/useUsers";

import { DenyRequestModal } from "./DenyRequestModal";

const RequestSkeleton = () => {
  return (
    <Flex align="center" justify="space-between">
      <HStack spacing={3} ml={5} minW="260px">
        <SkeletonCircle size="14" />
        <VStack alignItems="start" spacing={2}>
          <Skeleton height="18px" width="160px" />
          <Skeleton height="12px" width="220px" />
        </VStack>
      </HStack>

      <HStack spacing={5}>
        <Skeleton height="14px" width="110px" />
        <Skeleton height="32px" width="110px" borderRadius="md" />
        <Skeleton height="32px" width="110px" borderRadius="md" />
      </HStack>
    </Flex>
  );
};

export const UserPendingStatusList = () => {
  const { data: pendingUsers = [], isLoading, error } = useUsers({
    status: "pending",
  });

  const { mutate: updateUser } = useUpdateUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  // When Approve Button is clicked, update user status to approved
  const handleApprove = async (id) => {
    try {
      await updateUser({ id: id, data: { status: "approved" } });
    } catch (err) {
      console.error("Couldn't approve user", err);
    }
  };

  // When Deny Button is clicked, open modal
  const handleDeny = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    onClose();
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      border="0.5px solid #00000026"
      boxShadow="sm"
      p={4}
    >
      <VStack align="stretch">
        {isLoading ? (
          <>
            <RequestSkeleton />
            <RequestSkeleton />
            <RequestSkeleton />
          </>
        ) : error ? (
          <Text color="red.500">Failed to load pending requests.</Text>
        ) : (
          pendingUsers.map((req) => (
            <Flex key={req.id} align="center" justify="space-between">
              {/* Left */}
              <HStack spacing={3} ml={5} minW="260px">
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
                  <Text fontSize="xl" fontWeight="normal">
                    {req.firstName} {req.lastName}
                  </Text>
                  <Text fontSize="xs" fontWeight="normal" color="gray.500">
                    {req.email}
                  </Text>
                </Box>
              </HStack>

              <HStack spacing={5}>
                {/* Date */}
                <Text fontSize="sm" color="gray.500">
                  {req.userSignupDate
                    ? new Date(req.userSignupDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No Date"}
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
          ))
        )}
      </VStack>

      <DenyRequestModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </Box>
  );
};