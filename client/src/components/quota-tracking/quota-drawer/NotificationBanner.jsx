import { Box, Stack, Text } from "@chakra-ui/react";

import { AlertCircle } from "lucide-react";

import { actionMessage } from "./tools/constants";

export const NotificationBanner = ({ action }) => {

  const colors = action === "delete"
  ? { bg: "#FFD2D2", primary: "#CE0000" }
  : { bg: "#D2E8FF", primary: "#0050CE" };

  return (
    <Box
      bg={colors.bg}
      borderRadius="8px"
      p={4}
      border="2px solid"
      borderColor={colors.primary}
    >
      <Stack
        direction="row"
        align="center"
        mb={4}
      >
        <AlertCircle
          size={24}
          color={colors.primary}
        />
        <Text
          fontWeight="semibold"
          color={colors.primary}
          display="flex"
          alignItems="center"
          lineHeight="1"
        >
          Notification
        </Text>
      </Stack>

      <Text
        fontSize="sm"
        color={colors.primary}
      >
        {actionMessage[action ? action : "create"]}
      </Text>
    </Box>
  );
};
