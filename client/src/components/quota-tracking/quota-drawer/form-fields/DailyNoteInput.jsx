import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";

import { inputStyles } from "../tools/constants";

export const DailyNoteInput = ({ note, setNote, isLocked }) => {
  return (
    <FormControl>
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >Daily Notes</FormLabel>
      <Textarea
        placeholder="Start typing..."
        size="md"
        fontSize="14px"
        {...inputStyles}
        isReadOnly={isLocked}
        value={note ?? ""}
        onChange={(e) => setNote(e.target.value)}
      />
    </FormControl>
  );
};
