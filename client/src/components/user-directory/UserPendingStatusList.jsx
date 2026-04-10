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

export const UserPendingStatusList = ({ showAll = false }) => {
  const {
    data: pendingUsers = [],
    isLoading,
    error,
  } = useUsers({
    status: "pending",
  });

  const displayUsers = showAll ? pendingUsers : pendingUsers.slice(0, 2);

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
          displayUsers.map((req) => (
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
                  bg={req.photoUrl ? undefined : "#F9FAFB"}
                  color="#000"
                  fontFamily={"Lato"}
                  fontSize={"20px"}
                  fontStyle={"normal"}
                  fontWeight={"400"}
                  lineHeight={"normal"}
                  letterSpacing={"-0.8px"}
                />

                <Box>
                  <Text
                    fontSize="16px"
                    fontFamily={"Lato"}
                    fontStyle="normal"
                    fontWeight={"400"}
                    lineHeight="normal"
                    letterSpacing={-0.64}
                  >
                    {req.firstName} {req.lastName}
                  </Text>
                  <Text
                    fontSize="14px"
                    fontWeight="400"
                    color="rgba(0, 0, 0, 0.50)"
                    fontFamily={"Lato"}
                    fontStyle={"normal"}
                    lineHeight={"normal"}
                    letterSpacing={"-0.56px"}
                    mt={1}
                  >
                    {req.email}
                  </Text>
                </Box>
              </HStack>

              <HStack spacing={5}>
                {/* Date */}
                <Text
                  fontSize="14px"
                  color="rgba(0, 0, 0, 0.50)"
                  fontStyle={"normal"}
                  fontWeight={"400"}
                  lineHeight={"normal"}
                  letterSpacing={"-0.56px"}
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
                  color="#FFF"
                  _hover={{ bg: "blue.600" }}
                  onClick={() => handleApprove(req.id)}
                  display="flex"
                  width={113.347}
                  height={41}
                  padding={0}
                  justifyContent="center"
                  alignItems="center"
                  gap={15}
                  borderRadius="6px"
                  fontFamily="Lato"
                  fontSize="14px"
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="20px"
                >
                  Approve
                </Button>

                <Button
                  size="sm"
                  bg="white"
                  color="#1A202C"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleDeny(req)}
                  display="flex"
                  width={113.347}
                  height={41}
                  padding={0}
                  justifyContent="center"
                  alignItems="center"
                  gap={15}
                  borderRadius="6px"
                  border="1px solid #E2E8F0"
                  fontFamily="Lato"
                  fontSize="14px"
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="20px"
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
