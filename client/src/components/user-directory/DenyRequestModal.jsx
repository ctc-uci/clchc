import { useEffect, useState } from "react";

import { CheckCircleIcon } from "@chakra-ui/icons";
import {
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
  Avatar
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
                      bg="#FFFFFF"
                      borderRadius="xl"
                      align="center"
                      justify="center"
                      fontSize="lg"
                      src={user.photoUrl ?? undefined}
                      name={`${user.firstName ?? ""} ${user.lastName ?? ""}`}
                    >
                    </Avatar>

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

        <ModalFooter
          gap={3}
          px={8}
        >
          <Button
            bg="#D9D9D9"
            _hover={{ bg: "#CFCFCF" }}
            px={7}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            bg="#CE3131"
            _hover={{ bg: "#B92B2B" }}
            color="white"
            onClick={handleDeny}
          >
            Deny Request
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
