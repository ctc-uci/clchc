import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Input,
  VStack,
} from "@chakra-ui/react";

const VersionLogTable = ({ logs }) => {
  return (
    <VStack spacing={3} align="stretch">
      <Input
        placeholder="Search version logs"
        size="sm"
        bg="white"
      />
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
    >
      <Table size="sm">
        <Thead bg="gray.50">
          <Tr>
            <Th>Editor</Th>
            <Th>Action</Th>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>Provider</Th>
            <Th>Quota Created</Th>
          </Tr>
        </Thead>

        <Tbody>
          {logs.length === 0 && (
            <Tr>
              <Td colSpan={6}>
                <Text textAlign="center" py={6} color="gray.500">
                  No version history available
                </Text>
              </Td>
            </Tr>
          )}

          {logs.map((entry) => (
            <Tr key={entry.id} _hover={{ bg: "gray.50" }}>
              <Td>
                {entry.firstName} {entry.lastName}
              </Td>

              <Td fontWeight="medium">
                {entry.action === "increment" && "Quota +1"}
                {entry.action === "decrement" && "Quota -1"}
              </Td>

              <Td color="gray.600">{entry.date}</Td>
              <Td color="gray.600">{entry.time}</Td>

              <Td fontWeight="medium">{entry.provider}</Td>

              <Td color="gray.600">{entry.quotaCreated}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
    </VStack>
  );
};

export default VersionLogTable;