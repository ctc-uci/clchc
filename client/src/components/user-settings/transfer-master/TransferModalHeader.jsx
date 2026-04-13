import React from "react";

import { Box, HStack, ModalHeader, Text, VStack } from "@chakra-ui/react";

export default function TransferModalHeader({ step }) {
  return (
    <ModalHeader>
      <HStack
        justifyContent="center"
        alignItems="flex-start"
        spacing={0}
      >
        <VStack
          w="80px"
          align="center"
        >
          <Box
            w="43px"
            h="43px"
            bg={step >= 1 ? "#113D64" : "#EDF2F7"}
            borderRadius="full"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text color={step >= 1 ? "white" : "black"}>1</Text>
          </Box>
          <Text
            color="#808080"
            fontSize="14px"
            fontWeight="400"
            textAlign="center"
          >
            Select User
          </Text>
        </VStack>

        <Box
          w="53px"
          h="2px"
          bg="#EDF2F7"
          mt="21px"
          flexShrink={0}
        />

        <VStack
          w="80px"
          spacing={2}
          align="center"
        >
          <Box
            w="43px"
            h="43px"
            bg={step >= 2 ? "#113D64" : "#EDF2F7"}
            borderRadius="full"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text color={step >= 2 ? "white" : "black"}>2</Text>
          </Box>
          <Text
            color="#808080"
            fontSize="14px"
            fontWeight="400"
            textAlign="center"
          >
            Review
          </Text>
        </VStack>

        <Box
          w="53px"
          h="2px"
          bg="#EDF2F7"
          mt="21px"
          flexShrink={0}
        />

        <VStack
          w="80px"
          spacing={2}
          align="center"
        >
          <Box
            w="43px"
            h="43px"
            bg={step >= 3 ? "#113D64" : "#EDF2F7"}
            borderRadius="full"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text color={step >= 3 ? "white" : "black"}>3</Text>
          </Box>
          <Text
            color="#808080"
            fontSize="14px"
            fontWeight="400"
            textAlign="center"
          >
            Finalize
          </Text>
        </VStack>
      </HStack>
    </ModalHeader>
  );
}
