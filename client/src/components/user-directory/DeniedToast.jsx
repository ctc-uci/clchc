import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

export const DeniedToast = ({ user, onClose }) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      bg="#C6F6D5"
      px={4}
      py={3}
      minW="320px"
    >
      <Flex
        align="center"
        gap={3}
      >
        <CheckCircleIcon />
        <Box>
          <Text
            fontWeight="bold"
            fontSize="md"
            color="#2D3748"
          >
            Request Denied
          </Text>

          <Text
            fontWeight="medium"
            fontSize="sm"
            color="#065F46"
          >
            {`${user?.firstName ?? "User"} ${user?.lastName ?? ""} has been notified`}
          </Text>
        </Box>
      </Flex>
      <Button
        size="sm"
        variant="ghost"
        onClick={onClose}
      >
        ✕
      </Button>
    </Flex>
  );
};
