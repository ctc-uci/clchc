import { Badge, Box, Flex, Heading, Skeleton, Text } from "@chakra-ui/react";

export const PageHeader = ({ title, subheading, role, isLoading }) => {
  isLoading = true;
  return (
    <Box>
      <Flex
        align="center"
        gap={4}
      >
        <Heading
          fontSize="49.75px"
          fontWeight="semibold"
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
              variant="subtle"
              colorScheme="yellow"
              bg="yellow.400"
              borderRadius="4px"
              px={4}
              h="40px"
              display="flex"
              alignItems="center"
              fontSize="24px"
              textTransform="none"
              color="Black"
              fontWeight="500"
            >
              {role === "ccm" ? "Manager" : role === "ccs" ? "Staff" : role}
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
