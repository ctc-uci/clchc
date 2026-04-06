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
  customButtonText = "Save Changes"
}) {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="2xl"
        p={6}
        maxW="340px"
      >
        <ModalBody p={0}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            mb={1}
          >
            Are you Sure?
          </Text>
          <Text
            fontSize="sm"
            color="gray.500"
            mb={4}
          >
            {customText}
          </Text>

          <Box
            bg="gray.50"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            p={4}
            mb={6}
          >
            {preview}
          </Box>

          <Flex
            justify="center"
            gap={4}
          >
            <Button
              variant="outline"
              borderRadius="xl"
              borderColor="gray.300"
              px={8}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              bg="#113D64"
              color="white"
              borderRadius="xl"
              px={8}
              _hover={{ bg: "blue.900" }}
              isLoading={isSaving}
              loadingText="Saving"
              onClick={async () => {
                if (isSaving) return;

                setIsSaving(true);

                try {
                  const didSave = await onConfirm();

                  if (didSave === false) {
                    toast({
                      title: "Save failed",
                      description: "Please try again.",
                      status: "error",
                      duration: 4000,
                      isClosable: true,
                      position: "top-right",
                    });
                    return;
                  }

                  onClose();
                } catch (_error) {
                  toast({
                    title: "Save failed",
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
