import { Badge, Box, Flex, Heading, Text } from "@chakra-ui/react";

export const PageHeader = ({ title, subheading, role }) => {
  return (
    <Box>
      <Flex align="flex-end" gap={2}>
        <Heading size="lg" fontWeight="semibold">
          {title}
        </Heading>
        {role && (
          <Badge
            colorScheme="yellow"
            borderRadius="full"
            px={2}
            py={0.5}
            fontSize="xs"
            textTransform="none"
          >
            {role}
          </Badge>
        )}
      </Flex>
      {subheading && (
        <Text color="gray.500" mt={1}>
          {subheading}
        </Text>
      )}
    </Box>
  );
};
