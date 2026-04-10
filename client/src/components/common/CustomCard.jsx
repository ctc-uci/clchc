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
          fontFamily={"Lato"}
          fontStyle={"normal"}
          fontWeight={"400"}
          lineHeight={"normal"}
          color={"rgba(0, 0, 0, 0.50)"}
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
<<<<<<< HEAD
            fontSize="15.34px"
            color={footerColor ?? "rgba(0,0,0,0.5)"}
=======
            fontSize="16px"
            fontFamily={"Lato"}
            fontStyle={"normal"}
            fontWeight={"400"}
            lineHeight={"normal"}
            color={"rgba(0, 0, 0, 0.50)"}
>>>>>>> f623f99 (RAHHHHHHH)
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
