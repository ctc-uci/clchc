import React from "react";



import { Button, HStack, Text } from "@chakra-ui/react";



import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useUserContext } from "@/contexts/hooks/useUserContext";

export default function SignOutSection() {
  const { logout } = useAuthContext();
  const userData = useUserContext();
  const dbUser = userData?.dbUser;

  return (
    <HStack
      spacing="2em"
      align="center"
    >
      <Text fontSize="sm">
        You are currently signed in as{" "}
        <Text
          as="span"
          fontWeight="bold"
          display="block"
        >
          {dbUser?.firstName} {dbUser?.lastName}
        </Text>
      </Text>
      <Button
        bg="#113D64"
        color="white"
        onClick={logout}
        px="2em"
      >
        Sign Out
      </Button>
    </HStack>
  );
}
