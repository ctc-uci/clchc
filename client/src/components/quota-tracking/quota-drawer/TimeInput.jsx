import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
} from "@chakra-ui/react";

import { inputStyles } from "./constants";
import { formatTimeForDisplay } from "./utils";

export const TimeInput = ({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isLocked,
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
      >
        <FormLabel>Hours</FormLabel>
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
                  size="md"
                  type="time"
                  fontSize="sm"
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
                  size="md"
                  type="time"
                  fontSize="sm"
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
      </FormControl>
    </Flex>
  );
};
