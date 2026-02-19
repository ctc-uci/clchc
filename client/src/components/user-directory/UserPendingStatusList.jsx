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
  Table,
  Td,
  Text,
  Tr,
  VStack,
  Tbody
} from "@chakra-ui/react";

import {
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/contexts/hooks/data-fetching/useUsers";

const SkeletonRows = () => {
  return (
    <>
      <Table>
        <Tbody>
        {Array.from({ length: 1 }, (_, i) => (
       <Tr key={i} bg="white" spacing={3}>
          <Td>
            <HStack spacing={3}>
              <SkeletonCircle size="10" />
              <Box flex="1">
                <Skeleton
                  height="14px"
                  width="120px"
                  mb="2"
                />
                <Skeleton
                  height="12px"
                  width="80px"
                />
              </Box>
            </HStack>
          </Td>
          <Td>
            <Skeleton
              height="14px"
              width="200px"
            />
          </Td>

          <Td>
            <Skeleton
              height="20px"
              width="90px"
              borderRadius="md"
            />
          </Td>
          <Td>
            <HStack spacing={2}>
              <Skeleton
                height="32px"
                width="32px"
                borderRadius="md"
              />
              <Skeleton
                height="32px"
                width="32px"
                borderRadius="md"
              />
            </HStack>
          </Td>
        </Tr>
      ))}  
      </Tbody>
      </Table>
    </>
  );
};

export const UserPendingStatusList = () => {
  // const [pendingUsers, setPendingUsers] = useState([]);
  const {
    data: pendingUsers,
    isLoading,
  } = useUsers({ status: "pending" });
  const {
    mutate: updateUser,
  } = useUpdateUser();
  const {
    mutate: deleteUser,
  } = useDeleteUser();

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

  // if (isLoading) {
  //   return <Text> Loading pending users... </Text>;
  // }

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
          {isLoading ? <Skeleton width="5px" /> : pendingUsers.length}
        </Badge>
      </Flex>

      <VStack
        spacing={3}
        align="stretch"
      >
        {isLoading ? (
          <SkeletonRows />
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
