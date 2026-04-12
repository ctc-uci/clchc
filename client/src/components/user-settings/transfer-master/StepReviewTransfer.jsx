import { Button, Text } from "@chakra-ui/react";

export default function StepReviewTransfer({ onClose, selected, onNext }) {
  return (
    <>
      <Text>REVIEW TRANSFER</Text>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onNext}>Next</Button>
    </>
  );
}
