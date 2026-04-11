import { useState } from "react";

import {
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";

const TextPopup = ({ text = "", alwaysShowPopup = false, truncateAt }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <Box
          maxWidth="100px"
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Text
            isTruncated
            textDecoration="underline"
            noOfLines={1}
            color="#718096"
          >
            {text}
          </Text>
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          bg="blackAlpha.900"
          maxW="300px"
        >
          <PopoverArrow bg="blackAlpha.900" />
          <PopoverBody>
            <Text
              whiteSpace="pre-wrap"
              color="whiteAlpha.900"
            >
              {text}
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default TextPopup;