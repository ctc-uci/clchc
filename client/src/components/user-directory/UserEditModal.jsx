import { useEffect, useState } from "react";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

export default function UserEditModal({ isOpen, onClose, user, onUpdated }) {
  const { backend } = useBackendContext();
  const [selectedRole, setSelectedRole] = useState(user?.role ?? "viewer");

  useEffect(() => {
    setSelectedRole(user?.role ?? "viewer");
  }, [user]);

  if (!user) return null;

  const currentFirebaseUid = user.firebaseUid;
  const username = user.firstName + " " + user.lastName;
  const roleColors = {
    master: "red",
    ccm: "green",
    ccs: "blue",
    viewer: "yellow",
  };

  const onApprove = async () => {
    if (!currentFirebaseUid) {
      console.error("Approval failed: missing firebaseUid");
      return;
    }

    try {
      await backend.put("/users/update/set-role/", {
        role: selectedRole,
        firebaseUid: currentFirebaseUid,
      });
      if (onUpdated) await onUpdated();
      onClose();
    } catch (err) {
      console.error("Approval failed: ", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="scale"
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="16px"
        maxW="560px"
        maxH="480px"
        px={6}
        py={8}
        boxShadow="0 4px 14px rgba(0, 0, 0, 0.1)"
      >
        <ModalHeader
          fontWeight="500"
          fontSize="25px"
          pb={2}
        >
          Edit User
          <Text
            fontWeight="normal"
            fontSize="15px"
            color="#00000080"
            mt={1}
          >
            Change role and permissions
          </Text>
        </ModalHeader>

        <ModalBody>
          <Flex
            align="center"
            bg="gray.50"
            borderRadius="12px"
            px={4}
            py={4}
            mb={6}
            gap={3}
          >
            <Box
              size="xl"
              bg="white"
              color="black"
              borderRadius="10px"
            >
              <Avatar
                name={username}
                size="lg"
                bg="white"
                color="black"
              />
            </Box>
            <Flex
              justify="space-between"
              align="flex-start"
              width="100%"
            >
              <VStack
                alignItems="left"
                gap={0}
              >
                <Text
                  fontWeight="400"
                  fontSize="20px"
                >
                  {user.firstName} {user.lastName}
                </Text>
                <Text
                  fontSize="xs"
                  color="gray"
                >
                  {user.email}
                </Text>
              </VStack>
            </Flex>
            <Badge
              colorScheme={roleColors[user.role] || "gray"}
              ml="auto"
              borderRadius="7.2px"
              px={2}
              py={0.5}
              fontSize="xs"
            >
              {user.role}
            </Badge>
          </Flex>

          <Text
            fontWeight="500"
            fontSize="25px"
            mb={2}
          >
            New Role
          </Text>
          <Select
            borderRadius="14px"
            bg="#F9FAFB"
            value={selectedRole}
            _focus={{ borderColor: "gray.300" }}
            onChange={(e) => setSelectedRole(e.target.value)}
            size="lg"
            fontSize="20px"
            fontWeight="400"
            // maxW="450px"
            maxH="64px"
          >
            <option value="viewer">Viewer - View Only</option>
            <option value="ccs">Call Center Staff - Book appointments</option>
            <option value="ccm">Call Center Manager - Full Access</option>
          </Select>
        </ModalBody>

        <ModalFooter px={4}>
          <Flex
            width="75%"
            px={2}
          >
            <Button
              fontWeight="400"
              fontSize="20px"
              variant="outline"
              border="1px"
              borderRadius="14px"
              borderColor="#00000026"
              mr={3}
              onClick={onClose}
              flex="1"
              maxW="181px"
              py={4}
              h="auto"
              bg="#F9FAFB"
            >
              Cancel
            </Button>

            <Button
              fontWeight="400"
              fontSize="20px"
              colorScheme="blackAlpha"
              bg="black"
              color="white"
              borderRadius="14px"
              flex="1"
              maxW="181px"
              py={4}
              h="auto"
              onClick={async () => {
                onApprove();
              }}
              _hover={{ bg: "gray.800" }}
            >
              Approve
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
