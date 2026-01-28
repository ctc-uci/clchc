import {
  Box,
  Button,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

export const PendingApprovalPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      my={64}
      mx={12}
    >
      <VStack
        spacing={6}
        textAlign="center"
      >
        <Image
          src="/hourglass.svg"
          alt="Hourglass Icon"
          boxSize={20}
        />

        <Heading
          size="xl"
          fontWeight="semibold"
        >
          You are almost there!
        </Heading>

        <Text
          maxW={420}
          fontSize="lg"
          color="#5B5B5B"
          fontWeight="semibold"
          align="left"
          lineHeight="tall"
        >
          Thanks for signing in. Your account is currently waiting for
          administrator approval.
          <br />
          We’ve notified the team, and you’ll get an email confirmation as soon
          as your account is ready.
        </Text>

        <Button
          size="lg"
          variant="solid"
          bg="#DDDDDD"
          rounded="10px"
          asChild
          onClick={() => navigate("/login")}
        >
          <Text
            fontSize="xl"
            fontWeight="normal"
          >
            Return Login Page
          </Text>
        </Button>
      </VStack>
    </Box>
  );
};
