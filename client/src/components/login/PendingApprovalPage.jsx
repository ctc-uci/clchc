import { useEffect } from "react";

import { Box, Button, Heading, Image, Text, VStack } from "@chakra-ui/react";

import { useUserContext } from "@/contexts/hooks/useUserContext";
import { useNavigate } from "react-router-dom";

export const PendingApprovalPage = () => {
  const navigate = useNavigate();
  const { status } = useUserContext();

  useEffect(() => {
    if (status === "approved") {
      navigate("/quota-tracking", { replace: true });
    }
  }, [status, navigate]);

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
          w="190px"
          h="263px"
        />

        <Heading
          fontSize="32px"
          fontWeight="bold"
          color="#000"
        >
          You are almost there!
        </Heading>

        <Text
          maxW="580px"
          fontSize="16px"
          color="#5B5B5B"
          fontWeight="normal"
          textAlign="center"
        >
          Thanks for signing in.
          <br />
          Your account is currently waiting for administrator approval.
          <br />
          We’ve notified the team, and you’ll get an email confirmation as soon
          as your account is ready.
        </Text>

        <Button
          bg="#022442"
          color="white"
          h="40px"
          px="16px"
          borderRadius="6px"
          onClick={() => navigate("/login")}
          _hover={{ bg: "#033a6b" }}
        >
          Return Login Page
        </Button>
      </VStack>
    </Box>
  );
};
