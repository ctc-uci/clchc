import {
  Box,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";

import { MAX_INPUT_NUMBER } from "../tools/constants";

export function QuotaProgress({
  quota,
  setQuota,
  progress,
  setProgress,
  isLocked,
}) {
  const safeQuota = Number(quota) || 0;
  const safeProgress = Number(progress) || 0;
  const percent = safeQuota === 0 ? 0 : (safeProgress / safeQuota) * 100;

  const numberInputHandlerFactory = (setStateFn) => {
    return (valueAsString, valueAsNumber) => {
      if (Number.isNaN(valueAsNumber)) {
        setStateFn(0);
        return;
      }
      if (valueAsNumber > MAX_INPUT_NUMBER) {
        return;
      }
      setStateFn(valueAsNumber);
    };
  };

  return (
    <FormControl
      isRequired
      isDisabled={isLocked}
    >
      <FormLabel>Appointment Quota</FormLabel>
      <>
        <Progress
          value={percent}
          height="10px"
          borderRadius="999px"
          bg="gray.200"
          my={2}
          colorScheme="green"
        />
        <Box
          px={4}
          borderRadius="md"
          display="flex"
          flexDirection="column"
        >
          <Stack
            direction="row"
            align="center"
            justify="center"
            color="white"
            height="92px"
            gap="40px"
          >
            <Box
              position="relative"
              w="80px"
            >
              <NumberInput
                value={progress}
                min={0}
                max={MAX_INPUT_NUMBER}
                variant="unstyled"
                onChange={numberInputHandlerFactory(setProgress)}
                border="1px"
                borderColor="gray.300"
                borderRadius="6px"
                size="lg"
                w="80px"
              >
                <NumberInputField
                  textAlign="center"
                  fontSize="4xl"
                  p={0}
                  color="black"
                  placeholder=" "
                  bg="white"
                  borderRadius="6px"
                  h="64px"
                />
              </NumberInput>
            </Box>

            <Text
              fontSize="4xl"
              fontWeight="bold"
              color="black"
            >
              /
            </Text>

            <Box
              position="relative"
              w="80px"
            >
              <NumberInput
                value={quota}
                size="lg"
                min={0}
                max={MAX_INPUT_NUMBER}
                variant="unstyled"
                onChange={numberInputHandlerFactory(setQuota)}
                border="1px"
                borderColor="gray.300"
                borderRadius="6px"
                w="80px"
              >
                <NumberInputField
                  textAlign="center"
                  fontSize="4xl"
                  p={0}
                  color="black"
                  bg="white"
                  borderRadius="6px"
                  h="64px"
                />
              </NumberInput>
            </Box>
          </Stack>
        </Box>
      </>
    </FormControl>
  );
}
