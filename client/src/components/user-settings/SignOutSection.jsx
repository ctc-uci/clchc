import React from "react";
import { HStack, Text, Button } from "@chakra-ui/react";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useUserContext } from "@/contexts/hooks/useUserContext";

export default function SignOutSection() {
  const { logout } = useAuthContext();
  const userData = useUserContext();
  const dbUser = userData?.dbUser;

  return (
    <HStack spacing="2em" align="center">
      <Text fontSize="sm">
        You are currently signed in as{" "}
        <Text as="span" fontWeight="bold">
          {dbUser?.firstName} {dbUser?.lastName}
        </Text>
      </Text>
      <Button
        onClick={logout}
        px="2em"
      >
        Sign Out
      </Button>
    </HStack>
  );
}