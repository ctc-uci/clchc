import { Box, Stack, Text } from "@chakra-ui/react";

import { AlertCircle } from "lucide-react";

import { actionMessage } from "./constants";

export const NotificationBanner = ({ action }) => {
  return (
    <Box
      bg="#FFD2D2"
      borderRadius="8px"
      p={4}
      border="2px solid"
      borderColor="#CE0000"
    >
      <Stack
        direction="row"
        align="center"
        mb={4}
      >
        <AlertCircle
          size={24}
          color="#CE0000"
        />
        <Text
          fontWeight="semibold"
          color="#CE0000"
          display="flex"
          alignItems="center"
          lineHeight="1"
        >
          Notification
        </Text>
      </Stack>

      <Text
        fontSize="sm"
        color="#CE0000"
      >
        {actionMessage[action ? action : "create"]}
      </Text>
    </Box>
  );
};
