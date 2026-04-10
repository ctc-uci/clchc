// PendingRequestsPage.jsx

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { UserPendingStatusList } from "./UserPendingStatusList";

export const PendingRequestsPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      p={6}
    >
      <Flex
        align="center"
        mb={2}
      >
        <ArrowBackIcon
          boxSize={6}
          color="var(--Primary-2, #113D64)"
          cursor="pointer"
          onClick={() => navigate(-1)}
        />
      </Flex>

      <Text
        fontSize="12px"
        color="rgba(0, 0, 0, 0.50)"
        fontFamily={"Lato"}
        fontStyle={"normal"}
        fontWeight={"500"}
        lineHeight={"normal"}
        mb={2}
      >
        ALL PENDING REQUESTS
      </Text>

      <UserPendingStatusList showAll />
    </Box>
  );
};
