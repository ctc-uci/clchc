import { useState } from "react";

import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  preview,
  customText = "You are saving the following information",
  customButtonText = "Save Changes",
  customButtonColor = "#113D64",
}) {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay bg="blackAlpha.300" />
      <ModalContent
        borderRadius="20px"
        px={6}
        py={5}
        h="300px"
        maxW="400px"
        maxH="300px"
      >
        <ModalBody
          p={0}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          h="100%"
        >
          <Box>
            <Text
              fontSize="24px"
              fontWeight="600"
              mb={1}
            >
              Are you Sure?
            </Text>

            <Text
              fontSize="14px"
              color="gray.500"
              mb={5}
            >
              {customText}
            </Text>

            <Box
              bg="#F7F7F7"
              border="1px solid #E5E5E5"
              borderRadius="12px"
              px={4}
              py={3}
              mb={6}
            >
              {preview}
            </Box>
          </Box>

          <Flex
            justify="flex-end"
            gap={4}
            mt={2}
          >
            <Button
              variant="outline"
              borderRadius="6px"
              borderColor="gray.300"
              px="30px"
              height="40px"
              minH="40px"
              minW="110px"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              bg={customButtonColor}
              color="white"
              borderRadius="6px"
              px="30px"
              height="40px"
              minH="40px"
              minW="110px"
              isLoading={isSaving}
              loadingText="Saving"
              _hover={{ opacity: 0.9 }}
              onClick={async () => {
                if (isSaving) return;

                setIsSaving(true);
                try {
                  const didSave = await onConfirm();
                  if (didSave === false) throw new Error();
                  onClose();
                } catch {
                  toast({
                    title: "Action failed",
                    description: "Please try again.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top-right",
                  });
                } finally {
                  setIsSaving(false);
                }
              }}
            >
              {customButtonText}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
