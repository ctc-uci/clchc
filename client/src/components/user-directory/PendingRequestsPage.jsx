// PendingRequestsPage.jsx

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { UserPendingStatusList } from "./UserPendingStatusList";

export const PendingRequestsPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      p={10}
    >
      <Flex
        align="center"
        mb={2}
      >
        <ArrowBackIcon
          boxSize={5}
          cursor="pointer"
          onClick={() => navigate(-1)}
        />
      </Flex>

      <Text
        fontSize="xs"
        color="gray.500"
        mb={2}
      >
        ALL PENDING REQUESTS
      </Text>

      <UserPendingStatusList showAll />
    </Box>
  );
};
