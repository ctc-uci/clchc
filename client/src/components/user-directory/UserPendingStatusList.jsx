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
import {
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/contexts/hooks/data-fetching/useUsers";

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
  const {
    mutate: deleteUser,
    isLoading: isDeleting,
    error: errorDeleting,
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

  if (isLoading) {
    return <Text> Loading pending users... </Text>;
  }

  return (
    <Box
      borderRadius="lg"
      border="0.5px solid #00000026"
    >
      <VStack align="stretch">
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
                onClick={() => handleDeny(req.id)}
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
    </Box>
  );
};
