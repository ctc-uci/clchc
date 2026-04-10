import { Box, FormControl, FormLabel, Textarea } from "@chakra-ui/react";

import { inputStyles } from "../tools/constants";

export const DailyNoteInput = ({ note, setNote, isLocked }) => {
  return (
    <FormControl isDisabled={isLocked}>
      <FormLabel
        fontSize="14px"
        color="#113D64"
      >Daily Notes</FormLabel>
      {isLocked ? (
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
          {note ?? ""}
        </Box>
      ) : (
        <Textarea
          placeholder="Start typing..."
          size="md"
          fontSize="14px"
          {...inputStyles}
          value={note ?? ""}
          onChange={(e) => setNote(e.target.value)}
        />
      )}
    </FormControl>
  );
};
