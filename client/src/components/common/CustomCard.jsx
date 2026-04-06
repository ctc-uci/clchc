import { Card, CardBody, CardHeader, Text } from "@chakra-ui/react";

export const CustomCard = ({ title, body, footer, footerUnderline, height, width, flex }) => {
  return (
    <Card
      w={width}
      h={height}
      flex={flex}
      flexShrink={1}
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="box-shadow 0.2s ease"
    >
      <CardHeader pb={0}>
        <Text
          fontSize="16px"
          color="gray.500"
          fontWeight="medium"
        >
          {title}
        </Text>
      </CardHeader>

      <CardBody py={0}>
        <Text
          fontSize="30.679px"
          fontWeight="semibold"
          color="gray.900"
        >
          {body}
        </Text>
        {footer && (
          <Text
            fontSize="sm"
            color="gray.500"
            mt={1}
            textDecoration={footerUnderline ? "underline" : "none"}
          >
            {footer}
          </Text>
        )}
      </CardBody>
    </Card>
  );
};
