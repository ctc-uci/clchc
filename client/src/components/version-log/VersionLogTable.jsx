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

import { MdSentimentDissatisfied } from "react-icons/md";

const SkeletonRows = () => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Tr
          key={i}
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          {Array.from({ length: 4 }, (_, j) => (
            <Td
              key={j}
              borderRight="1px solid"
              borderColor="gray.200"
            >
              <Skeleton height="40px" />
            </Td>
          ))}
        </Tr>
      ))}
    </>
  );
};

const thProps = {
  fontFamily: "Inter",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: "700",
  lineHeight: "16px",
  letterSpacing: "0.6px",
  padding: "15px 25px 15px 25px",
  backgroundColor: "#C8D4E6",
  color: "#113D64",
  borderRight: "1px solid",
  borderColor: "gray.200",
};

const tdProps = {
  borderRight: "1px solid",
  borderColor: "gray.200",
  padding: "16px 24px",
  gap: "10px",
};

const tdTextProps = {
  fontFamily: "Lato",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "20px",
  color: "#2D3748",
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
          sx={{
            "tbody tr:nth-of-type(even)": { bg: "#F9F9F9" },
            "tbody tr:nth-of-type(odd)": { bg: "white" },
          }}
        >
          <Thead
            position="sticky"
            top={0}
            zIndex={1}
            h="40px"
          >
            <Tr>
              <Th {...thProps}>Editor</Th>
              <Th {...thProps}>Action</Th>
              <Th {...thProps}>Date & Time</Th>
              <Th {...thProps} borderRight="none">Provider</Th>
            </Tr>
          </Thead>

          <Tbody>
            {!loading && logs.length === 0 && (
              <Tr>
                <Td colSpan={4} height={"424px"} textAlign="center" py={10}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <MdSentimentDissatisfied size={69} color="#586771" />
                    <Text fontFamily="Lato" fontSize="18px" color="gray.500">
                      No audit logs found.
                    </Text>
                  </Box>
                </Td>
              </Tr>
            )}

            {loading ? (
              <SkeletonRows />
            ) : (
              logs.map((entry) => {
                const logDate = new Date(entry.timestamp);

                const formattedDate = logDate.toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                });

                const formattedTime = logDate
                  .toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .toLowerCase();

                return (
                  <Tr
                    key={entry.id}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    cursor="default"
                  >
                    <Td {...tdProps}>
                      <Text {...tdTextProps}>
                        {entry.firstName} {entry.lastName}
                      </Text>
                    </Td>
                    <Td {...tdProps}>
                      {entry.action === "increment" && (
                        <Text {...tdTextProps}>
                          Quota{" "}
                          <Text as="span" color="#2F9E5B" fontWeight="600">
                            +{entry.delta}
                          </Text>
                        </Text>
                      )}
                      {entry.action === "decrement" && (
                        <Text {...tdTextProps}>
                          Quota{" "}
                          <Text as="span" color="#D64545" fontWeight="600">
                            {entry.delta}
                          </Text>
                        </Text>
                      )}
                    </Td>
                    <Td {...tdProps}>
                      <Text {...tdTextProps}>
                        {formattedDate} {formattedTime}
                      </Text>
                    </Td>
                    <Td {...tdProps}>
                      <Text {...tdTextProps}>{entry.providerName}</Text>

                    </Td>
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
