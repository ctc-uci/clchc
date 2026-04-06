import { useEffect, useState } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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

import {
  useDeleteUserByFirebaseUid,
  useUpdateUserByFirebaseUid,
} from "@/contexts/hooks/data-fetching/useUsers";

export default function UserEditModal({ isOpen, onClose, user, onUpdated }) {
  const [selectedRole, setSelectedRole] = useState(user?.role ?? "viewer");
  const { mutateAsync: updateUser } = useUpdateUserByFirebaseUid();
  const { mutateAsync: deleteUser } = useDeleteUserByFirebaseUid();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsDeleteOpen(false);
      setDeleteInput("");
      setSelectedRole(user?.role ?? "viewer");
    }
  }, [isOpen, user]);

  const roleOptions = [
    { value: "ccm", label: "Call Center Manager" },
    { value: "ccs", label: "Call Center Staff" },
    { value: "viewer", label: "Viewer" },
  ];

  const selectedRoleLabel =
    roleOptions.find((r) => r.value === selectedRole)?.label || "Select Role";

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
      await updateUser({
        uid: currentFirebaseUid,
        data: {
          role: selectedRole,
        },
      });
      if (onUpdated) await onUpdated();
      onClose();
    } catch (err) {
      console.error("Approval failed: ", err);
    }
  };

  const onDelete = async () => {
    if (!currentFirebaseUid) {
      console.error("Deletion failed: missing firebaseUid");
      return;
    }

    try {
      await deleteUser({ uid: currentFirebaseUid });
      if (onUpdated) await onUpdated();
      onClose();
    } catch (err) {
      console.error("Deletion failed: ", err);
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
        borderRadius="15px"
        maxW="560px"
        maxH="80vh"
        px={3}
        py={6}
        boxShadow="0 4px 14px rgba(0, 0, 0, 0.1)"
      >
        <ModalHeader>
          {isDeleteOpen ? (
            <>
              <Text
                fontWeight="600"
                fontSize="28px"
              >
                Are you Sure?
              </Text>
              <Text
                fontWeight="normal"
                fontSize="15px"
                color="#00000080"
              >
                You are removing this individuals access to CLCHC
              </Text>
            </>
          ) : (
            <>
              <Text
                fontWeight="500"
                fontSize="25px"
              >
                Edit User
              </Text>
              <Text
                fontWeight="normal"
                fontSize="15px"
                color="#00000080"
              >
                Change role and permissions
              </Text>
            </>
          )}
        </ModalHeader>

        <ModalBody>
          <Flex
            align="center"
            bg="#F9F9F9"
            border="0.5px solid rgba(0, 0, 0, 0.15)"
            borderRadius="8px"
            px={4}
            py={2}
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
                src={user.photoUrl ?? undefined}
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

          <Flex justify="flex-end">
            <Text
              color="#90080F"
              fontWeight="400"
              fontSize="16px"
              fontStyle="italic"
              cursor="pointer"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete User
            </Text>
          </Flex>
          {isDeleteOpen ? (
            <Box mb={48}>
              <Text mb={2}>
                Type{" "}
                <Text
                  as="span"
                  color="#90080F"
                >
                  ‘Delete’
                </Text>{" "}
                to confirm
              </Text>

              <Input
                placeholder="type ‘Delete’"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                bg="#F9FAFB"
                borderRadius="12px"
                h="56px"
              />
            </Box>
          ) : (
            <>
              <Text
                color="rgba(0, 0, 0, 0.50)"
                fontWeight="400"
                fontSize="16px"
                mb={2}
              >
                Change Role
              </Text>
              <Box mb={48}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bg="#F9FAFB"
                    borderRadius="12px"
                    h="56px"
                    px="16px"
                    w="100%"
                    fontWeight="400"
                    fontSize="16px"
                    textAlign="left"
                    _hover={{ bg: "#F9FAFB" }}
                    _active={{ bg: "#F9FAFB" }}
                  >
                    {selectedRoleLabel}
                  </MenuButton>

                  <MenuList
                    borderRadius="16px"
                    boxShadow="0px 10px 25px rgba(0,0,0,0.1)"
                    p="8px"
                    bg="white"
                  >
                    {roleOptions.map((role) => (
                      <MenuItem
                        key={role.value}
                        onClick={() => setSelectedRole(role.value)}
                        borderRadius="10px"
                        px="12px"
                        py="10px"
                        _hover={{ bg: "#F3F4F6" }}
                      >
                        {role.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>

              <Flex
                align="center"
                mt={5}
              >
                <input
                  type="checkbox"
                  defaultChecked
                />
                <Text
                  ml={2}
                  color="#00000080"
                >
                  Notify user via email
                </Text>
              </Flex>
            </>
          )}
        </ModalBody>

        <ModalFooter>
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
            {isDeleteOpen ? (
              <>
                <Button
                  fontWeight="400"
                  fontSize="20px"
                  colorScheme="blackAlpha"
                  bg="#90080F"
                  color="white"
                  borderRadius="14px"
                  flex="1"
                  maxW="181px"
                  py={4}
                  h="auto"
                  onClick={async () => {
                    onDelete();
                  }}
                  _hover={{ bg: "#A50F15" }}
                  isDisabled={deleteInput !== "Delete"}
                >
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  fontWeight="400"
                  fontSize="20px"
                  colorScheme="blackAlpha"
                  bg="#6ECA65"
                  color="white"
                  borderRadius="14px"
                  flex="1"
                  maxW="181px"
                  py={4}
                  h="auto"
                  onClick={async () => {
                    onApprove();
                  }}
                  _hover={{ bg: "#0C824D" }}
                >
                  Confirm
                </Button>
              </>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
