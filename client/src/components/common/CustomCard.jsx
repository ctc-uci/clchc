import { Card, CardBody, CardHeader, Text } from "@chakra-ui/react";

export const CustomCard = ({ title, body, footer, footerUnderline, footerColor, height, width }) => {
  return (
    <Card
      w={width}
      h={height}
      flexShrink={0}
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="box-shadow 0.2s ease"
    >
      <CardHeader pb="9px">
        <Text
          fontSize="16px"
          color="rgba(0,0,0,0.5)"
          fontWeight="normal"
          lineHeight="1"
        >
          {title}
        </Text>
      </CardHeader>

      <CardBody py={0}>
        <Text
          fontSize="30.68px"
          fontWeight="medium"
          color="gray.900"
          lineHeight="1"
          letterSpacing="-0.04em"
        >
          {body}
        </Text>
        {footer && (
          <Text
            fontSize="15.34px"
            color={footerColor ?? "rgba(0,0,0,0.5)"}
            mt={1}
            lineHeight="1"
            textDecoration={footerUnderline ? "underline" : "none"}
          >
            {footer}
          </Text>
        )}
      </CardBody>
    </Card>
  );
};
