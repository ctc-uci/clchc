import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";



export const PendingApprovalPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthContext(); // firebase user
  const { backend } = useBackendContext();

  // const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkApproval = async () => {
      if (!currentUser) {
        // setChecking(false);
        return;
      }

      try {
        const res = await backend.get(`/users/firebase/${currentUser.uid}`);
        const users = res.data[0];

        if (users?.status === "approved") {
          navigate("/quota-tracking", { replace: true });
        }
      } catch (err) {
        console.error("Approval check failed", err);
      } finally {
        // setChecking(false);
      }
    };

    checkApproval();
  }, []);


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
