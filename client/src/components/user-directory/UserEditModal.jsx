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
  useUsers,
} from "@/contexts/hooks/data-fetching/useUsers";

export default function UserEditModal({ isOpen, onClose, userId, onUpdated }) {
  const { data: users = [] } = useUsers({ status: "approved" });
  const user = users.find((u) => u.id === userId) ?? null;

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
    if (user) setSelectedRole(user.role ?? "viewer");
  }, [user]);

  if (!user) return null;3

  const currentFirebaseUid = user.firebaseUid;
  const username = user.firstName + " " + user.lastName;
  const roleColors = {
    master: { bg: "#573D59", color: "white" },
    ccm: { bg: "#07B8AC", color: "white" },
    ccs: { bg: "#3498DB", color: "white" },
    viewer: { bg: "#C8D4E6", color: "gray.800" },
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
  };asdf

  const onDelete = async () => {
    if (!currentFirebaseUid) {
      console.error("Deletion failed: missing firebaseUid");
      return;
    }

    try {
      await deleteUser(currentFirebaseUid);
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
        px={3}
        py={6}
        width="394px"
        minH="490px"
        borderRadius="15px"
      >
        <ModalHeader py={0}>
          {isDeleteOpen ? (
            <>
              <Text
                py={0}
                fontWeight="500"
                fontSize="25px"
              >
                Are you Sure?
              </Text>
              <Text
                fontSize="14px"
                color="#00000080"
                fontWeight="400"
                mt={-1}
                mb={1}
              >
                You are removing this individuals access to CLCHC
              </Text>
            </>
          ) : (
            <>
              <Text
                py={0}
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
              bg="white"
              color="black"
              borderRadius="10px"
              minW="40px"
              minH="38px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={1}
            >
              <Avatar
                name={username}
                size="sm"
                bg="white"
                src={user.photoUrl ?? undefined}
                color="black"
              />
              {/* width: 40.50943374633789; */}
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
                  fontSize="14px"
                >
                  {user.firstName} {user.lastName}
                </Text>
                <Text
                  fontSize="12px"
                  color="gray"
                >
                  {user.email}
                </Text>
              </VStack>
            </Flex>
            <Badge
              bg={roleColors[user.role]?.bg || "gray.200"}
              color={roleColors[user.role]?.color || "white"}
              borderRadius="6px"
              px="6px"
              py="2px"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="400"
              lineHeight="16px"
              textTransform={
                user.role === "viewer" || user.role === "master"
                  ? "capitalize"
                  : "uppercase"
              }
            >
              {user.role}
            </Badge>
          </Flex>

          <Flex justify="flex-end">
            {!isDeleteOpen && (
            <Text
              color="#90080F"
              fontWeight="400"
              fontSize="14px"
              mt={1}
              cursor="pointer"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete User
            </Text>)}
          </Flex>
          {isDeleteOpen ? (
            <Box my={4}>
              <Text fontSize="14px">
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
                h="41px"
                mt={2}
              />

            </Box>
          ) : (
            <>
              <Text
                color="rgba(0, 0, 0, 0.50)"
                fontWeight="400"
                fontSize="14px"
                mb={2}
              >
                Change Role
              </Text>
              <Box mb={36}>
                <Menu matchWidth>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bg="#F9FAFB"
                    border="none"
                    borderWidth="0"
                    outline="none"
                    boxShadow="none"
                    borderRadius="6px"
                    h="50px"
                    px="16px" 
                    w="343px"
                    fontWeight="400"
                    fontStyle="normal"
                    fontSize="12px"
                    lineHeight="100%"
                    letterSpacing="-0.04em"
                    textAlign="left"
                    _hover={{ bg: "#F9FAFB" }}
                    _active={{ bg: "#F9FAFB" }}
                  > 

                    {selectedRoleLabel}
                  </MenuButton>

                  <MenuList
                    bg="#F9FAFB"
                    border="none"
                    borderRadius="6px"
                    p="8px"
                  >
                    {roleOptions.map((role) => (
                      <MenuItem
                        key={role.value}
                        bg="#F9FAFB"
                        onClick={() => setSelectedRole(role.value)}
                        borderRadius="8px"
                        px="12px" 
                        py="12px"
                        fontWeight="400"
                        fontStyle="normal"
                        fontSize="12px"
                        lineHeight="100%"
                        letterSpacing="-0.04em"
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

        <ModalFooter py={0}>
          <Flex
            width="75%"
          >
            <Button
              fontWeight="400"
              fontSize="14px"
              variant="outline"
              border="1px"
              borderRadius="6px"
              borderColor="#00000026"
              mr={3}
              onClick={onClose}
              flex="1"
              maxW="181px"
              px="30px"
              py="10px"
              h="41px"
              bg="#FFFFFF"
            >
              Cancel
            </Button>
            {isDeleteOpen ? (
              <>
                <Button
                  fontWeight="400"
                  fontSize="14px"
                  colorScheme="blackAlpha"
                  bg="#90080F"
                  color="white"
                  borderRadius="6px"
                  flex="1"
                  maxW="181px"
                  px="30px"
                  py="10px"
                  h="41px"
                  onClick={async () => {
                    await onDelete();
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
                  fontSize="14px"
                  colorScheme="blackAlpha"
                  bg="#0C824D"
                  color="white"
                  borderRadius="6px"
                  flex="1"
                  maxW="181px"
                  px="30px"
                  py="10px"
                  h="41px"
                  onClick={async () => {
                    await onApprove();
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
