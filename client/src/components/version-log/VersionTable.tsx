import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from "@chakra-ui/react";

//need to create a versionLog.ts in types so this has something to import from
//import { VersionLogEntry } from "@/types/versionLog";

type Props = {
  entries: VersionLogEntry[];
};

export const UniversalVersionLogTable = ({ entries }: Props) => {
  return (
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
            <Th>Quota for day of</Th>
          </Tr>
        </Thead>

        <Tbody>
          {entries.length === 0 && (
            <Tr>
              <Td colSpan={6}>
                <Text
                  textAlign="center"
                  py={6}
                  color="gray.500"
                >
                  No version history available
                </Text>
              </Td>
            </Tr>
          )}

          {entries.map(entry => (
            <Tr
              key={entry.id}
              _hover={{ bg: "gray.50" }}
            >
              <Td>{entry.editor}</Td>

              <Td>
                {entry.action}
                {entry.delta !== undefined && (
                  <Text
                    as="span"
                    ml={2}
                    color={entry.delta > 0 ? "green.500" : "red.500"}
                    fontWeight="medium"
                  >
                    {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                  </Text>
                )}
              </Td>

              <Td color="gray.600">{entry.date}</Td>
              <Td color="gray.600">{entry.time}</Td>

              <Td fontWeight="medium">
                {entry.providerName}
              </Td>

              <Td color="gray.600">
                {entry.quotaDay}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UniversalVersionLogTable;