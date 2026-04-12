import React from "react";

import { Box, HStack, ModalHeader, Text, VStack } from "@chakra-ui/react";

export default function TransferModalHeader({ step }) {
    return (
    <ModalHeader>
          <HStack
            justifyContent="center"
            alignItems="flex-start"
          >
            <VStack>
              <Box
                w="43px"
                h="43px"
                bg={step >= 1 ? "#113D64" : "#EDF2F7"}
                borderRadius="10000"
                justifyContent="center"
                alignItems="center"
                display="flex"
              >
                <Text color={step >= 1 ? "white" : "black"}> 1 </Text>
              </Box>
              <Text
                color="#808080"
                fontSize="14px"
                fontWeight="400"
              >
                Select User
              </Text>
            </VStack>
            <Box
              w="53px"
              h="2px"
              bg="#EDF2F7"
              mt="21px"
            />
            <VStack>
              <Box
                w="43px"
                h="43px"
                bg={step >= 2 ? "#113D64" : "#EDF2F7"}
                borderRadius="10000"
                justifyContent="center"
                alignItems="center"
                display="flex"
              >
                <Text color={step >= 2 ? "white" : "black"}> 2 </Text>
              </Box>
              <Text
                color="#808080"
                fontSize="14px"
                fontWeight="400"
              >
                Review
              </Text>
            </VStack>
            <Box
              w="53px"
              h="2px"
              bg="#EDF2F7"
              mt="21px"
            />
            <VStack>
              <Box
                w="43px"
                h="43px"
                bg={step >= 3 ? "#113D64" : "#EDF2F7"}
                borderRadius="10000"
                justifyContent="center"
                alignItems="center"
                display="flex"
              >
                <Text color={step >= 3 ? "white" : "black"}> 3 </Text>
              </Box>
              <Text
                color="#808080"
                fontSize="14px"
                fontWeight="400"
              >
                Finalize
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
    )
}