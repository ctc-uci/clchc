import { Box, FormControl, FormLabel, Textarea } from "@chakra-ui/react";

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
          minH="70px"
          bg="gray.50"
          color="gray.500"
          whiteSpace="pre-wrap"
        >
          {note ?? ""}
        </Box>
      ) : (
        <Textarea
          placeholder="Start typing..."
          size="md"
          minH="70px"
          resize="vertical"
          {...inputStyles}
          value={note ?? ""}
          onChange={(e) => setNote(e.target.value)}
        />
      )}
    </FormControl>
  );
};
