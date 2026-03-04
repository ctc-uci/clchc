import {
  Box,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
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
            textUnderlineOffset="3px"
            color="gray.600"
            noOfLines={1}
          >
            {text}
          </Text>
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          bg="blackAlpha.500"
          maxW="300px"
        >
          <PopoverArrow bg="blackAlpha.500" />
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
