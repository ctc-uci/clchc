import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  preview,
}) {
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
        maxW="420px"
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
            You are saving the following information
          </Text>

          <Box
            bg="gray.50"
            borderRadius="xl"
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
              px={8}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              bg="navy"
              color="white"
              borderRadius="xl"
              px={8}
              _hover={{ bg: "blue.900" }}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Save Changes
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
