import { WarningIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/contexts/hooks/data-fetching/useUsers";

const RequestSkeleton = () => {
  return (
    <Flex
      bg="white"
      p={4}
      borderRadius="md"
      align="center"
      justify="space-between"
      boxShadow="sm"
    >
      {/* Placeholder Icon */}
      <Skeleton
        boxSize="24px"
        borderRadius="full"
      />

      {/* Left - Avatar & Info */}
      <HStack
        spacing={3}
        minW="260px"
      >
        <SkeletonCircle size="10" />
        <VStack alignItems="start">
          <Skeleton
            height="14px"
            width="120px"
          />
          <Skeleton
            height="12px"
            width="180px"
          />
        </VStack>
      </HStack>

      {/* Date */}
      <Skeleton
        height="14px"
        width="80px"
      />

      {/* Role */}
      <Skeleton
        height="14px"
        width="60px"
      />

      {/* Actions */}
      <HStack spacing={2}>
        <Skeleton
          height="32px"
          width="80px"
          borderRadius="md"
        />
        <Skeleton
          height="32px"
          width="80px"
          borderRadius="md"
        />
      </HStack>
    </Flex>
  );
};

export const UserPendingStatusList = () => {
  // const [pendingUsers, setPendingUsers] = useState([]);
  const { data: pendingUsers, isLoading } = useUsers({ status: "pending" });
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  //When Approve Button is clicked, update user status to active
  const handleApprove = async (id) => {
    try {
      await updateUser({ id: id, data: { status: "approved" } });
    } catch (err) {
      console.error("Couldn't approve user", err);
    }
  };

  //When Deny Button is clicked, delete user from database
  const handleDeny = async (id) => {
    try {
      await deleteUser(id);
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
        gap={2}
      >
        <WarningIcon color="orange.400" />
        <Text fontWeight="semibold">Pending Requests</Text>

        {isLoading ? (
          <Skeleton boxSize="20px" />
        ) : (
          <Badge
            colorScheme="red"
            borderRadius="full"
            px={2}
          >
            {pendingUsers.length}
          </Badge>
        )}
      </Flex>

      <VStack
        spacing={3}
        align="stretch"
      >
        {isLoading ? (
          <RequestSkeleton />
        ) : (
          pendingUsers.map((req) => (
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
          ))
        )}
      </VStack>
    </Box>
  );
};
