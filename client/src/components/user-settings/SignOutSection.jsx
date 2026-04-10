import React from "react";



import { Box, Button, HStack, Text, useDisclosure, Flex, Avatar, Tag } from "@chakra-ui/react";



import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useUserContext } from "@/contexts/hooks/useUserContext";

import ConfirmationModal from "./ConfirmationModal";

const ROLE_LABELS = {
    viewer: "Viewer",
    ccm: "CCM",
    ccs: "CCS",
    master: "Master",
  };

export default function SignOutSection() {
  const { currentUser, logout } = useAuthContext();
  const userData = useUserContext();
  const dbUser = userData?.dbUser;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirmSignOut = async () => {
    try {
      await logout();
      return true;
    } catch (_error) {
      return false;
    }
  };

  const modalPreview = (
  <Flex align="center" gap={3}>
    <Avatar
      name={`${dbUser?.firstName} ${dbUser?.lastName}`}
      src={currentUser?.photoURL}
      size="sm"
      bg="#FFF"
      color="black"
      borderRadius="10px"
      w="36px"
      h="36px"
      fontSize="14px"
    />

    <Box flex={1}>
      <Text fontWeight="600" fontSize="14px">
        {dbUser?.firstName} {dbUser?.lastName}
      </Text>
      <Text fontSize="12px" color="gray.500">
        {dbUser?.email}
      </Text>
    </Box>

    <Tag
      border="1px solid #D1D5DB"
      borderRadius="8px"
      px={2}
      py="2px"
      fontSize="12px"
      bg="#F5F5F5"
    >
      {ROLE_LABELS[dbUser?.role] || dbUser?.role}
    </Tag>
  </Flex>
);

  return (
    <>
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
            fontSize="22px"
            mt="5px"
          >
            {dbUser?.firstName} {dbUser?.lastName}
          </Text>
        </Text>
        <Button
          bg="#113D64"
          color="white"
          onClick={onOpen}
          px="2em"
          justifyContent="center"
          display="flex"
        >
          Sign Out
        </Button>
      </HStack>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirmSignOut}
        preview={modalPreview}
        customText="You are signing out this account"
        customButtonText="Sign Out"
      />
    </>
  );
}
