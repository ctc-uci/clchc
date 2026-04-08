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
  const shouldShowPopUp =
    alwaysShowPopup || (truncateAt && text.length > truncateAt);

  return (
    <Popover trigger="click">
      <PopoverTrigger>
        <Box
          maxWidth="100px"
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