import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";

import { inputStyles } from "../tools/constants";

export const DailyNoteInput = ({ note, setNote, isLocked }) => {
  return (
    <FormControl isDisabled={isLocked}>
      <FormLabel>Daily Notes</FormLabel>
      {isLocked ? (
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
          {note ?? ""}
        </Box>
      ) : (
        <Input
          placeholder="Start typing..."
          size="md"
          {...inputStyles}
          value={note ?? ""}
          onChange={(e) => setNote(e.target.value)}
        />
      )}
    </FormControl>
  );
};
