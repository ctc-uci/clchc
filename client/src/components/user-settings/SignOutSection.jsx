import React from "react";



import { Box, Button, HStack, Text, useDisclosure, Flex, Avatar, Tag } from "@chakra-ui/react";



import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useUserContext } from "@/contexts/hooks/useUserContext";

import ConfirmationModal from "./ConfirmationModal";

export default function SignOutSection() {
  const { logout } = useAuthContext();
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
    <Flex
          align="center"
          gap={3}
        >
          <Avatar
            name={`${dbUser?.firstName} ${dbUser?.lastName}`}
            size="sm"
            bg="#FFF"
            color="gray.700"
            borderRadius="10px"
            w="40px"
            h="40px"
          />
          <Box flex={1} bg="#F9F9F9" w="340px">
            <Text
              fontWeight="semibold"
              fontSize="sm"
            >
              {dbUser?.firstName} {dbUser?.lastName}
            </Text>
            <Text
              fontSize="xs"
              color="gray.500"
            >
              {dbUser?.email}
            </Text>
          </Box>
          <Tag
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            paddingY="0"
            paddingX="8px"
            h="20px"
            px={2}
            py={0.5}
          >
            <Text fontSize="sm">{dbUser?.role}</Text>
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
          >
            {dbUser?.firstName} {dbUser?.lastName}
          </Text>
        </Text>
        <Button
          bg="#113D64"
          color="white"
          onClick={onOpen}
          px="2em"
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
