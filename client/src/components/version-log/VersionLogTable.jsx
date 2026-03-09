import React from "react";

import {
  Box,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

const SkeletonRows = () => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Tr key={i}>
          <Td>
            <Skeleton height="30px" />
          </Td>
          <Td>
            <Box
              display="flex"
              flexDirection="row"
              gap={2}
            >
              <Skeleton
                height="30px"
                width="40%"
              />
              <Skeleton
                height="30px"
                width="25%"
              />
            </Box>
          </Td>
          <Td>
            <Skeleton height="30px" />
          </Td>
          <Td>
            <Skeleton
              height="30px"
              width="50%"
            />
          </Td>
          <Td>
            <Box
              display="flex"
              flexDirection="column"
              gap="2px"
            >
              <Skeleton height="15px" />
              <Skeleton
                height="10px"
                width="80%"
              />
            </Box>
          </Td>
          <Td>
            <Skeleton height="30px" />
          </Td>
        </Tr>
      ))}
    </>
  );
};

const VersionLogTable = ({ loading, logs }) => {
  return (
    <VStack
      spacing={3}
      align="stretch"
    >
      <TableContainer
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        maxHeight="60vh"
        overflowY="auto"
      >
        <Table
          size="sm"
          sx={{ tableLayout: "fixed" }}
        >
          <Thead
            bg="#EBEBEB"
            position="sticky"
            top={0}
            h="60px"
            zIndex={1}
          >
            <Tr>
              <Th width="20%">Editor</Th>
              <Th width="15%">Action</Th>
              <Th width="15%">Date</Th>
              <Th width="15%">Time</Th>
              <Th width="17.5%">Provider</Th>
              <Th width="17.5%">Quota Created</Th>
            </Tr>
          </Thead>

          <Tbody>
            {!loading && logs.length === 0 && (
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

            {loading ? (
              <SkeletonRows />
            ) : (
              logs.map((entry) => {
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
                            +{entry.delta}
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
              })
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default VersionLogTable;
