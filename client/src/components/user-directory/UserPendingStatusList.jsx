import { useState } from "react";

import { WarningIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
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
    <Flex
      align="center"
      justify="space-between"
    >
      <HStack
        spacing={3}
        ml={5}
        minW="260px"
      >
        <SkeletonCircle size="14" />
        <VStack
          alignItems="start"
          spacing={2}
        >
          <Skeleton
            height="18px"
            width="160px"
          />
          <Skeleton
            height="12px"
            width="220px"
          />
        </VStack>
      </HStack>

      <HStack spacing={5}>
        <Skeleton
          height="14px"
          width="110px"
        />
        <Skeleton
          height="32px"
          width="110px"
          borderRadius="md"
        />
        <Skeleton
          height="32px"
          width="110px"
          borderRadius="md"
        />
      </HStack>
    </Flex>
  );
};

export const UserPendingStatusList = () => {
  const {
    data: pendingUsers = [],
    isLoading,
    error,
  } = useUsers({
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
    >
      <Grid
        templateColumns="1fr"
        gap={0}
      >
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
            <Flex
              key={req.id}
              align="center"
              borderTop="1px solid #E2E8F0"
              borderRadius="md"
              p={3}
              // mb={2}
              justify="space-between"
            >
              {/* Left */}
              <HStack
                spacing={3}
                ml={5}
                minW="260px"
              >
                <Avatar
                  w="58px"
                  h="58px"
                  borderRadius="xl"
                  src={req.photoUrl ?? undefined}
                  name={`${req.firstName ?? ""} ${req.lastName ?? ""}`}
                />

                <Box>
                  <Text
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight={400}
                    lineHeight="normal"
                    letterSpacing={-0.64}
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
                  bg="#113D64"
                  color="white"
                  py={1}
                  px={8}
                  _hover={{ bg: "blue.600" }}
                  onClick={() => handleApprove(req.id)}
                  display="flex"
                  width={113.347}
                  height={41}
                  padding={0}
                  justify-content="center"
                  align-items="center"
                  gap={15}
                  border-radius="6px"
                  fontSize={14}
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="20px"
                >
                  Approve
                </Button>

                <Button
                  size="sm"
                  bg="white"
                  color=" var(--gray-800, #1A202C)"
                  py={1}
                  px={8}
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleDeny(req)}
                  display="flex"
                  width={113.347}
                  height={41}
                  padding={0}
                  justify-content="center"
                  align-items="center"
                  gap={15}
                  border-radius="6px"
                  fontSize={14}
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="20px"
                  border="0.5px solid rgba(0, 0, 0, 0.15)"
                >
                  Deny
                </Button>
              </HStack>
            </Flex>
          ))
        )}
      </Grid>

      <DenyRequestModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </Box>
  );
};
