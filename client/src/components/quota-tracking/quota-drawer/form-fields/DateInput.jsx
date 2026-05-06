import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";

import CalendarCard from "../../../common/CalendarCard";

export const DateInput = ({ date, setDate, isLocked, isInvalid }) => {
  return (
    <FormControl
      isRequired
      w="45%"
      isInvalid={isInvalid}
    >
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >Date</FormLabel>
      <CalendarCard
        value={date ?? ""}
        onChange={setDate}
        fullWidth
        isReadOnly={isLocked}
      />
      <FormErrorMessage>Required</FormErrorMessage>
    </FormControl>
  );
};
