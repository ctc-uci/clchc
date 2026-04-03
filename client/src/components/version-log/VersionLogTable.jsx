import React from "react";

import {
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

const CELL_BORDER_COLOR = "#E2E8F0";
const HEADER_BG = "#CBD7E8";
const COLUMN_WIDTH = "25%";

const SkeletonRows = () => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Tr
          key={i}
          borderBottom="1.5px solid"
          borderColor={CELL_BORDER_COLOR}
        >
          <Td
            w={COLUMN_WIDTH}
            py="18px"
            borderColor={CELL_BORDER_COLOR}
          >
            <Skeleton height="24px" />
          </Td>
          <Td
            w={COLUMN_WIDTH}
            py="18px"
            borderColor={CELL_BORDER_COLOR}
          >
            <Skeleton
              height="24px"
              width="90px"
            />
          </Td>
          <Td
            w={COLUMN_WIDTH}
            py="18px"
            borderColor={CELL_BORDER_COLOR}
          >
            <Skeleton
              height="24px"
              width="140px"
            />
          </Td>
          <Td
            w={COLUMN_WIDTH}
            py="18px"
          >
            <Skeleton
              height="24px"
              width="220px"
            />
          </Td>
        </Tr>
      ))}
    </>
  );
};

const headerCellProps = () => ({
  w: COLUMN_WIDTH,
  h: "48px",
  px: "28px",
  py: "12px",
  color: "#4A5568",
  fontSize: "16px",
  fontWeight: "700",
  textTransform: "none",
  borderBottom: "1.5px solid",
  borderColor: CELL_BORDER_COLOR,
  bg: HEADER_BG,
});

const bodyCellProps = () => ({
  w: COLUMN_WIDTH,
  px: "28px",
  py: "18px",
  fontSize: "16px",
  color: "#2D3748",
  borderBottom: "1.5px solid",
  borderColor: CELL_BORDER_COLOR,
  verticalAlign: "middle",
});

const VersionLogTable = ({ loading, logs }) => {
  return (
    <VStack
      spacing={3}
      align="stretch"
    >
      <TableContainer
        w="100%"
        maxW="1360px"
        minH="818px"
        borderRadius="6px"
        border="1.5px solid"
        borderColor={CELL_BORDER_COLOR}
        p="12px"
        bg="white"
        overflowX="auto"
        overflowY="auto"
      >
        <Table
          variant="unstyled"
          sx={{ tableLayout: "fixed" }}
        >
          <Thead>
            <Tr>
              <Th {...headerCellProps()}>Editor</Th>
              <Th {...headerCellProps()}>Action</Th>
              <Th {...headerCellProps()}>Date & Time</Th>
              <Th {...headerCellProps()}>Provider</Th>
            </Tr>
          </Thead>

          <Tbody>
            {!loading && logs.length === 0 && (
              <Tr>
                <Td
                  colSpan={4}
                  py="40px"
                  textAlign="center"
                  color="gray.500"
                  fontSize="16px"
                >
                  No version history available
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
                    _hover={{ bg: "#F8FAFC" }}
                  >
                    <Td {...bodyCellProps()}>
                      {entry.firstName} {entry.lastName}
                    </Td>

                    <Td {...bodyCellProps()}>
                      {entry.action === "increment" && (
                        <>
                          Quota{" "}
                          <Text
                            as="span"
                            color="#38A169"
                            fontWeight="500"
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
                            color="#E53E3E"
                            fontWeight="500"
                          >
                            {entry.delta}
                          </Text>
                        </>
                      )}
                    </Td>

                    <Td {...bodyCellProps()}>
                      {formattedDate} {formattedTime}
                    </Td>

                    <Td {...bodyCellProps()}>
                      {entry.providerData["Name"]}
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
