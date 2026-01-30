import React from "react";

import {
  Avatar,
  Button,
  Flex,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";

import LogoutModal from "./LogoutModal.jsx";
import { CALCULATION_FACTOR, DELETE_ACCOUNT, PERSONAL_INFO } from "./Settings";

export default function Sidebar({ currentView, setCurrentView }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuthContext(); // deconstructing context to get user info
  const { role } = useRoleContext();
  const User = () => (
    <VStack align="center">
      <Avatar size="2xl" />
      <Text>{currentUser.displayName || currentUser.email}</Text>
      <Text>{role}</Text>
    </VStack>
  );

  const FactorButton = () => {
    return role === "ccm" || role === "master" ? (
      <Button onClick={() => setCurrentView(CALCULATION_FACTOR)}>
        Calculation Factor
      </Button>
    ) : null;
  };

  const NavButtons = () => (
    <VStack
      align="stretch"
      spacing="1em"
    >
      <Button onClick={() => setCurrentView(PERSONAL_INFO)}>
        Personal Information
      </Button>
      <FactorButton />
      <Button onClick={onOpen}>Log Out</Button>
      <Button onClick={() => setCurrentView(DELETE_ACCOUNT)}>
        Delete Account
      </Button>
    </VStack>
  );

  return (
    <>
      <LogoutModal
        isOpen={isOpen}
        onClose={onClose}
      />
      <VStack
        align="stretch"
        spacing="2em"
        backgroundColor="#ddd"
        borderRadius="1em"
        padding="1.5em"
      >
        <User />
        <NavButtons />
      </VStack>
    </>
  );
}
