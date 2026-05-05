import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, CloseButton } from "@chakra-ui/react";

const ToastAlert = ({ status, borderColor, title, description, onClose }) => (
  <Alert
    status={status}
    borderBottom={`4px solid ${borderColor}`}
    boxShadow="md"
    pr={8}
    position="relative"
  >
    <AlertIcon />
    <Box>
      <AlertTitle fontSize="14px" fontWeight="700">{title}</AlertTitle>
      <AlertDescription fontSize="12px">{description}</AlertDescription>
    </Box>
    <CloseButton
      position="absolute"
      right={2}
      top="50%"
      transform="translateY(-50%)"
      boxSize="18px"
      onClick={onClose}
    />
  </Alert>
);

export default ToastAlert;
