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
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { Delete } from "lucide-react";

import LogoutModal from "./LogoutModal.jsx";
import { CALCULATION_FACTOR, DELETE_ACCOUNT, PERSONAL_INFO } from "./Settings";

export default function Sidebar({ currentView, setCurrentView }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuthContext(); // deconstructing context to get user info
  const { role } = useUserContext();

  const User = () => (
    <VStack align="center">
      <Avatar size="2xl" />
      <Text>{currentUser.displayName || currentUser.email}</Text>
      <Text>{role}</Text>
    </VStack>
  );

  const PersonalButton = () => (
    <Button
      backgroundColor={
        currentView === PERSONAL_INFO && !isOpen ? "#bbb" : undefined
      }
      onClick={() => setCurrentView(PERSONAL_INFO)}
    >
      Personal Information
    </Button>
  );

  const FactorButton = () => {
    return role === "ccm" || role === "master" ? (
      <Button
        backgroundColor={
          currentView === CALCULATION_FACTOR && !isOpen ? "#bbb" : undefined
        }
        onClick={() => setCurrentView(CALCULATION_FACTOR)}
      >
        Calculation Factor
      </Button>
    ) : null;
  };

  const LogoutButton = () => (
    <Button
      onClick={onOpen}
      backgroundColor={isOpen ? "#bbb" : undefined}
    >
      Log Out
    </Button>
  );

  const DeleteButton = () => (
    <Button
      backgroundColor={
        currentView === DELETE_ACCOUNT && !isOpen ? "#bbb" : undefined
      }
      onClick={() => setCurrentView(DELETE_ACCOUNT)}
    >
      Delete Account
    </Button>
  );

  const NavButtons = () => (
    <VStack
      align="stretch"
      spacing="1em"
    >
      <PersonalButton />
      <FactorButton />
      <LogoutButton />
      <DeleteButton />
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
        margin="1.5em"
      >
        <User />
        <NavButtons />
      </VStack>
    </>
  );
}
