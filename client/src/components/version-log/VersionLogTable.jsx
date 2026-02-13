import React from "react";

import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

const VersionLogTable = ({ loading, logs }) => {
  return (
    <VStack
      spacing={3}
      align="stretch"
    >
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
                  <Text
                    textAlign="center"
                    py={6}
                    color="gray.500"
                  >
                    {loading ? "Loading..." : "No version history available"}
                  </Text>
                </Td>
              </Tr>
            )}

            {logs.map((entry) => {
              const log_d = new Date(entry.timestamp);

              const log_date = log_d.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              });

              const log_time = log_d.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              const quota_d = new Date(entry.date);

              const quota_date = quota_d.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              });

              return (
                <Tr
                  key={entry.id}
                  _hover={{ bg: "gray.50" }}
                >
                  <Td>
                    {entry.firstName} {entry.lastName}
                  </Td>

                  <Td fontWeight="medium">
                    {entry.action === "increment" && (
                      <>
                        Quota{" "}
                        <Text
                          as="span"
                          color="green.500"
                        >
                          {entry.delta}
                        </Text>
                      </>
                    )}
                    {entry.action === "decrement" && (
                      <>
                        Quota{" "}
                        <Text
                          as="span"
                          color="red.500"
                        >
                          {entry.delta}
                        </Text>
                      </>
                    )}
                  </Td>

                  <Td color="gray.600">{log_date}</Td>
                  <Td color="gray.600">{log_time}</Td>

                  <Td fontWeight="medium">
                    {entry.providerData["Name"]}
                    <Text
                      fontWeight="normal"
                      color="gray.500"
                    >
                      {entry.providerData["Office Hours"]}
                    </Text>
                    {/* TODO: We should really camel case the jsonb data keys. */}
                  </Td>

                  <Td color="gray.600">{quota_date}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default VersionLogTable;
