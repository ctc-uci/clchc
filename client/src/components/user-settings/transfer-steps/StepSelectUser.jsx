import { Button, Text } from "@chakra-ui/react";

export default function StepSelectUser({ onClose, onSelect, onNext }) {
  return (
    <>
      <Text>SELECT USER</Text>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onNext}>Next</Button>
    </>
  );
}
