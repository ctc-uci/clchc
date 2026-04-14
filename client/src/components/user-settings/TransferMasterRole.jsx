import React from "react";

import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";

import { AlertCircle } from "lucide-react";

import TransferMasterRoleModal from "./TransferMasterRoleModal.jsx";

export default function TransferMasterRole({ isOpen, onOpen, onClose }) {
  return (
    <>
      <Box
        w="100%"
        bg="#EDF2F7"
        borderRadius="4px"
      >
        <HStack
          pl="2.5em"
          pr="2em"
          py="1em"
        >
          <VStack
            w="100%"
            align="flex-start"
            gap="0"
          >
            <Text
              fontWeight="bold"
              fontSize="22px"
            >
              Transfer Master Role
            </Text>
            <Text
              fontSize="14px"
              color="gray.600"
            >
              Hand off 'Master' privileges to another team member. This action
              is irreversible.
            </Text>
            <Box
              bg="#92CAFD"
              borderRadius="5px"
              p={4}
              border="2px solid"
              borderColor="#0052CE"
              mt="10px"
            >
              <VStack align="flex-start">
                <HStack>
                  <AlertCircle
                    size={24}
                    color="#0052CE"
                  />
                  <Text
                    fontWeight="semibold"
                    color="#0052CE"
                    display="flex"
                    alignItems="center"
                    lineHeight="1"
                  >
                    This action cannot be undone
                  </Text>
                </HStack>
                <Text
                  fontSize="sm"
                  color="#0052CE"
                  ml="32px"
                >
                  Once transferred, only the new Master can grant you Master
                  privileges again.
                </Text>
              </VStack>
            </Box>
          </VStack>
          <Button
            minW="155px"
            h="48px"
            bg="#113D64"
            color="white"
            borderRadius="6px"
            onClick={onOpen}
          >
            <Text
              fontSize="18px"
              paddingX="24px"
            >
              Begin Transfer
            </Text>
          </Button>
        </HStack>
      </Box>

      <TransferMasterRoleModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
