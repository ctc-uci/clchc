import { Button, HStack, Text, VStack } from "@chakra-ui/react";

export default function StepReviewTransfer({ onClose, selected, onNext }) {
  return (
    <>
      <VStack alignItems="flex-start">
        <Text
          fontSize="14px"
          fontWeight="400"
        >
          Step 2: Review Transfer
        </Text>
        <Text
          fontSize="14px"
          fontWeight="400"
          color="gray.600"
        >
          Confirm the details of this role transfer.
        </Text>
      </VStack>
      <HStack
        justifyContent="flex-end"
        gap="10px"
      >
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
