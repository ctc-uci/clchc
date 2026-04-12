import { Button, HStack, Text } from "@chakra-ui/react";

export default function StepSelectUser({ onClose, onSelect, onNext }) {
  return (
    <>
      <Text>SELECT USER</Text>
      <HStack justifyContent="flex-end" gap="10px">
        <Button
          onClick={onClose}
          minW="155px"
          height="48px"
          paddingX="24px"
          justifyContent="center"
          display="flex"
          bg="white"
          border="0.5px solid #D9D9D9"
        >
          Cancel
        </Button>
        <Button
          onClick={onNext}
          minW="155px"
          height="48px"
          paddingX="24px"
          justifyContent="center"
          display="flex"
          bg="#113D64"
          color="white"
          border="0.5px solid #D9D9D9"
        >
          Next
        </Button>
      </HStack>
    </>
  );
}
