import { useEffect, useState } from "react";

import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import { useDeleteUser } from "@/contexts/hooks/data-fetching/useUsers";

import { DeniedToast } from "./DeniedToast";

export const DenyRequestModal = ({ isOpen, onClose, user }) => {
  const toast = useToast();
  const { mutateAsync: deleteUser, error: errorDeleting } = useDeleteUser();
  const [reason, setReason] = useState("");
  const [notifyUser, setNotifyUser] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setNotifyUser(true);
    }
  }, [isOpen, user]);

  const showDeniedToast = () => {
    toast({
      position: "top-right",
      duration: 4000,
      isClosable: true,
      render: ({ onClose }) => (
        <DeniedToast
          user={user}
          onClose={onClose}
        />
      ),
    });
  };

  const handleDeny = async () => {
    if (!user) return;

    try {
      await deleteUser(user.id);
      showDeniedToast();
      onClose();
    } catch (err) {
      console.error("Couldn't deny user request", err);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />

      <ModalContent
        borderRadius="2xl"
        px={3}
        py={5}
      >
        <ModalHeader>
          <Text
            fontSize="3xl"
            fontWeight="medium"
          >
            Deny User Request
          </Text>
          <Text
            fontSize="md"
            fontWeight="normal"
            color="#00000080"
          >
            This user will not be granted access
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {user && (
            <>
              <Box
                borderRadius="lg"
                border="0.5px solid #00000026"
                bg="#F8FBFF"
              >
                <Flex
                  justify="space-between"
                  align="center"
                >
                  <Flex
                    align="center"
                    gap={3}
                    p={2}
                  >
                    <Avatar
                      w="58px"
                      h="58px"
                      borderRadius="xl"
                      src={user.photoUrl ?? undefined}
                      name={`${user.firstName ?? ""} ${user.lastName ?? ""}`}
                    ></Avatar>

                    <Box>
                      <Text
                        fontWeight="normal"
                        fontSize="md"
                      >
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text
                        fontWeight="normal"
                        fontSize="xs"
                        color="#00000080"
                      >
                        {user.email}
                      </Text>
                    </Box>
                  </Flex>
                  <Text
                    fontSize="sm"
                    color="#00000080"
                    p={4}
                  >
                    {user.userSignupDate
                      ? new Date(user.userSignupDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </Text>
                </Flex>
              </Box>

              <Text
                mt={5}
                mb={2}
                color="#00000080"
              >
                Reason (optional)
              </Text>
              <Textarea
                placeholder="e.g write correct email"
                _placeholder={{ color: "#00000026" }}
                value={reason}
                borderRadius="lg"
                onChange={(e) => setReason(e.target.value)}
              />

              <Checkbox
                mt={4}
                isChecked={notifyUser}
                onChange={(e) => setNotifyUser(e.target.checked)}
                color="#00000080"
              >
                Notify user via email
              </Checkbox>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Flex w="75%">
            <Button
              fontWeight="400"
              fontSize="20px"
              variant="outline"
              border="1px"
              borderRadius="6px"
              borderColor="#00000026"
              mr={3}
              onClick={onClose}
              flex="1"
              maxW="181px"
              py={3}
              h="auto"
              bg="#F9FAFB"
            >
              Cancel
            </Button>
            <Button
              fontWeight="400"
              fontSize="20px"
              colorScheme="blackAlpha"
              bg="#90080F"
              color="white"
              borderRadius="6px"
              flex="1"
              maxW="181px"
              py={3}
              h="auto"
              onClick={handleDeny}
              _hover={{ bg: "#A50F15" }}
            >
              Deny
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
