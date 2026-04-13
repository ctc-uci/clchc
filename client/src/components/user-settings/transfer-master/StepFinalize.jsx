import { useState } from "react";

import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";

export default function StepFinalize({ onClose, onSelect, onFinalize }) {
  const [selectedOption, setSelectedOption] = useState(null);
  return (
    <>
      <VStack alignItems="flex-start" h="100%">
        <Text
          fontSize="14px"
          fontWeight="400"
        >
          Step 3: Finalize
        </Text>
        <Text
          fontSize="14px"
          fontWeight="400"
          color="gray.600"
        >
          Choose what happens to your account after transfer.
        </Text>

        <Box
          bg={selectedOption === "ccm" ? "#E7E7E7" : "#F7F7F7"}
          border="1px solid #E5E5E5"
          borderRadius="8px"
          px={4}
          py={3}
          w="95%"
          onClick={() => {
            setSelectedOption("ccm");
            onSelect("ccm");
          }}
        >
          <Text
            fontSize="14px"
            fontWeight="400"
          >
            Keep my account as CCM
          </Text>
          <Text
            fontSize="12px"
            color="gray.500"
          >
            You will be demoted to Call Center manager and retain full platform
            access.
          </Text>
        </Box>
        <Box
          bg={selectedOption === "delete" ? "#E7E7E7" : "#F7F7F7"}
          border="1px solid #E5E5E5"
          borderRadius="8px"
          px={4}
          py={3}
          w="95%"
          onClick={() => {
            setSelectedOption("delete");
            onSelect("delete");
          }}
        >
          <Text
            fontSize="14px"
            fontWeight="400"
          >
            Delete my account Permanently
          </Text>
          <Text
            fontSize="12px"
            color="gray.500"
          >
            Your account will be permanently removed from CLCHC. This cannot be
            undone.
          </Text>
        </Box>
      </VStack>
      <HStack
        justifyContent="flex-end"
        gap="10px"
        mt="118px"
      >
        <Button
          onClick={onClose}
          minW="155px"
          height="48px"
          paddingX="24px"
          justifyContent="center"
          display="flex"
          bg="white"
          border="0.5px solid #D9D9D9"
        >
          Cancel
        </Button>
        <Button
          onClick={onFinalize}
          minW="155px"
          height="48px"
          paddingX="24px"
          justifyContent="center"
          display="flex"
          bg="#113D64"
          color="white"
          border="0.5px solid #D9D9D9"
          isDisabled={!selectedOption}
        >
          Next
        </Button>
      </HStack>
    </>
  );
}
