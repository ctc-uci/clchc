import { Badge, Box, Flex, Heading, Skeleton, Text } from "@chakra-ui/react";

const roleBadgeColor = {
  ccm: "#07B8AC",
  viewer: "#C8D4E6",
  ccs: "#35639D",
  master: "#573D59",
};

export const PageHeader = ({ title, subheading, role, isLoading }) => {
  return (
    <Box>
      <Flex
        align="center"
        gap={4}
        // lineHeight="1"
      >
        <Heading
          color={"#000"}
          fontFamily={"Lato"}
          fontSize={"25px"}
          fontStyle={"normal"}
          fontWeight={"400"}
          lineHeight={"normal"}
        >
          {title}
        </Heading>
        {isLoading ? (
          <Skeleton
            h="40px"
            w="90px"
            borderRadius="4px"
            startColor="yellow.400"
            endColor="yellow.200"
          />
        ) : (
          role && (
            <Badge
              display="inline-flex"
              minW="30px"
              padding="2px 12px"
              alignItems="center"
              justifyContent="center"
              gap="6px"
              borderRadius="6px"
              border="0.5px solid rgba(171, 102, 50, 0.15)"
              background={roleBadgeColor[role] ?? "#573D59"}
              color="#FFF"
              fontFamily="Lato"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="400"
              lineHeight="16px"
              textTransform="none"
            >
              {role === "ccm" ? "Manager" : role === "ccs" ? "Staff" : role === "viewer" ? "Viewer" : role === "master" ? "Master" : role}
            </Badge>
          )
        )}
      </Flex>
      {subheading && (
        <Text
          color="gray.500"
          mt={1}
        >
          {subheading}
        </Text>
      )}
    </Box>
  );
};
