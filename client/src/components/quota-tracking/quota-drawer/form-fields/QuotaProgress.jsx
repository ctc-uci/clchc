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
  isInvalid,
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
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >Appointment Quota</FormLabel>
      <>
        <Progress
          value={percent}
          height="16px"
          borderRadius="4px"
          bg="gray.200"
          my={2}
          colorScheme="green"
          sx={{
            "& > div": {
              transition:
                "width 0.4s cubic-bezier(0.33, 1, 0.68, 1), background-color 0.2s ease",
            },
            "@media (prefers-reduced-motion: reduce)": {
              "& > div": { transition: "none" },
            },
          }}
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
              w="110px"
            >
              <NumberInput
                value={progress}
                min={0}
                max={MAX_INPUT_NUMBER}
                variant="unstyled"
                onChange={numberInputHandlerFactory(setProgress)}
                border={isInvalid ? "1px solid #FC8181" : "1.5px solid var(--gray-200, #E2E8F0)"}
                borderRadius="9px"
                size="lg"
                w="110px"
              >
                <NumberInputField
                  textAlign="center"
                  fontSize="30px"
                  p={0}
                  color="black"
                  placeholder=" "
                  bg="white"
                  borderRadius="9px"
                  h="70px"
                />
              </NumberInput>
            </Box>

            <Text
              w="56px"
              h="60px"
              fontSize="40px"
              fontWeight="bold"
              color="black"
              textAlign="center"
              lineHeight="60px"
            >
              /
            </Text>

            <Box
              position="relative"
              w="110px"
            >
              <NumberInput
                value={quota}
                size="lg"
                min={0}
                max={MAX_INPUT_NUMBER}
                variant="unstyled"
                onChange={numberInputHandlerFactory(setQuota)}
                border={isInvalid ? "1px solid #FC8181" : "1.5px solid var(--gray-200, #E2E8F0)"}
                borderRadius="9px"
                w="110px"
              >
                <NumberInputField
                  textAlign="center"
                  fontSize="30px"
                  p={0}
                  color="black"
                  bg="white"
                  borderRadius="9px"
                  h="70px"
                />
              </NumberInput>
            </Box>
          </Stack>
        </Box>
      </>
    </FormControl>
  );
}
