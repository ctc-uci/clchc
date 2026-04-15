import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
} from "@chakra-ui/react";

import { inputStyles } from "../tools/constants";
import { formatTimeForDisplay } from "../tools/utils";

export const TimeInput = ({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isLocked,
  isInvalid,
}) => {
  const handleStartTimeChange = (value) => {
    setStartTime(value);

    if (endTime && value && endTime < value) {
      setEndTime("");
    }
  };

  const handleEndTimeChange = (value) => {
    if (startTime && value && value < startTime) {
      return;
    }

    setEndTime(value);
  };

  return (
    <Flex
      direction="column"
      width="50%"
    >
      <FormControl
        isRequired
        isDisabled={isLocked}
        isInvalid={isInvalid}
      >
        <FormLabel
          fontSize="14px"
          color="#113D64"
        >Hours</FormLabel>
        <Flex
          gap={2}
          minW={0}
        >
          {isLocked ? (
            <>
              <InputGroup
                flex="1"
                minW={0}
              >
                <Box
                  w="100%"
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="6px"
                  px={3}
                  py={2}
                  fontSize="14px"
                  bg="gray.50"
                  color="gray.500"
                >
                  {formatTimeForDisplay(startTime)}
                </Box>
              </InputGroup>
              <InputGroup
                flex="1"
                minW={0}
              >
                <Box
                  w="100%"
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="6px"
                  px={3}
                  py={2}
                  bg="gray.50"
                  color="gray.500"
                >
                  {formatTimeForDisplay(endTime)}
                </Box>
              </InputGroup>
            </>
          ) : (
            <>
              <InputGroup
                flex="1"
                minW={0}
              >
                <Input
                  fontSize="14px"
                  size="md"
                  type="time"
                  px={3}
                  {...inputStyles}
                  w="100%"
                  sx={{
                    "&::-webkit-calendar-picker-indicator": {
                      display: "none",
                    },
                    "&::-webkit-clear-button": {
                      display: "none",
                    },
                    "&::-webkit-inner-spin-button": {
                      display: "none",
                    },
                  }}
                  value={startTime ?? ""}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                />
              </InputGroup>
              <InputGroup
                flex="1"
                minW={0}
              >
                <Input
                  fontSize="14px"
                  type="time"
                  px={3}
                  {...inputStyles}
                  w="100%"
                  sx={{
                    "&::-webkit-calendar-picker-indicator": {
                      display: "none",
                    },
                    "&::-webkit-clear-button": {
                      display: "none",
                    },
                    "&::-webkit-inner-spin-button": {
                      display: "none",
                    },
                  }}
                  min={startTime || undefined}
                  value={endTime ?? ""}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                />
              </InputGroup>
            </>
          )}
        </Flex>
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>
    </Flex>
  );
};
