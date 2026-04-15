import {
  Box,
  FormControl,
  FormLabel,
  InputGroup,
} from "@chakra-ui/react";

import CalendarCard from "../../../common/CalendarCard";
import { LockRightElement } from "../tools/shared";
import { formatDateForDisplay } from "../tools/utils";

export const DateInput = ({ date, setDate, isLocked }) => {
  return (
    <FormControl
      isRequired
      w="45%"
      isDisabled={isLocked}
    >
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >Date</FormLabel>
      {isLocked ? (
        <InputGroup>
          <Box
            w="100%"
            border="1px"
            borderColor="gray.300"
            borderRadius="6px"
            px={3}
            py={2}
            fontSize="14px"
            pr="2.25rem"
            bg="gray.50"
            color="gray.500"
          >
            {formatDateForDisplay(date)}
          </Box>
          <LockRightElement />
        </InputGroup>
      ) : (
        <CalendarCard
          value={date ?? ""}
          onChange={setDate}
          fullWidth
        />
      )}
    </FormControl>
  );
};
