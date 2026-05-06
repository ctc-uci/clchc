import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
} from "@chakra-ui/react";

import { inputStyles } from "../tools/constants";

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
                "&::-webkit-calendar-picker-indicator": { display: "none" },
                "&::-webkit-clear-button": { display: "none" },
                "&::-webkit-inner-spin-button": { display: "none" },
              }}
              readOnly={isLocked}
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
                "&::-webkit-calendar-picker-indicator": { display: "none" },
                "&::-webkit-clear-button": { display: "none" },
                "&::-webkit-inner-spin-button": { display: "none" },
              }}
              readOnly={isLocked}
              min={startTime || undefined}
              value={endTime ?? ""}
              onChange={(e) => handleEndTimeChange(e.target.value)}
            />
          </InputGroup>
        </Flex>
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>
    </Flex>
  );
};
