import {Text, Button} from "@chakra-ui/react";

export default function StepSelectUser({ onClose, onSelect, onFinalize }) {
  return ( <>
    <Text> FINALIZE </Text>
    <Button onClick={onClose}>Cancel</Button>
    <Button onClick={onFinalize}>
      Next
    </Button>
    </>
  );
}