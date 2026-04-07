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

const CELL_BORDER_COLOR = "#E7EDF5";
const VERTICAL_BORDER_COLOR = "#EDF2F7";
const HEADER_BG = "#C7D5E8";
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
            px="26px"
            borderColor={CELL_BORDER_COLOR}
            borderRight="1px solid"
            borderRightColor={VERTICAL_BORDER_COLOR}
          >
            <Skeleton height="24px" />
          </Td>
          <Td
            w={COLUMN_WIDTH}
            py="18px"
            px="26px"
            borderColor={CELL_BORDER_COLOR}
            borderRight="1px solid"
            borderRightColor={VERTICAL_BORDER_COLOR}
          >
            <Skeleton
              height="24px"
              width="90px"
            />
          </Td>
          <Td
            w={COLUMN_WIDTH}
            py="18px"
            px="26px"
            borderColor={CELL_BORDER_COLOR}
            borderRight="1px solid"
            borderRightColor={VERTICAL_BORDER_COLOR}
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
  h: "44px",
  px: "26px",
  py: "12px",
  color: "#1f4672",
  fontSize: "15px",
  fontWeight: "700",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  borderBottom: "1px solid",
  borderRight: "1px solid",
  borderColor: CELL_BORDER_COLOR,
  borderRightColor: VERTICAL_BORDER_COLOR,
  bg: HEADER_BG,
});

const bodyCellProps = (withRightBorder = true) => ({
  w: COLUMN_WIDTH,
  px: "26px",
  py: "30px",
  fontSize: "15px",
  color: "#2D3748",
  borderBottom: "1px solid",
  borderColor: CELL_BORDER_COLOR,
  borderRight: withRightBorder ? "1px solid" : "none",
  borderRightColor: VERTICAL_BORDER_COLOR,
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
        minH="720px"
        borderRadius="6px"
        border="1px solid"
        borderColor={CELL_BORDER_COLOR}
        p="0"
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
              <Th
                {...headerCellProps()}
                borderRight="none"
              >
                Provider
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {!loading && logs.length === 0 && (
              <Tr>
                <Td
                  colSpan={4}
                  py="40px"
                  textAlign="center"
                  color="#718096"
                  fontSize="15px"
                >
                  No version history available
                </Td>
              </Tr>
            )}

            {loading ? (
              <SkeletonRows />
            ) : (
              logs.map((entry, index) => {
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
                    bg={index % 2 === 0 ? "white" : "#FAFBFC"}
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
                            color="#2F9E5B"
                            fontWeight="600"
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
                            color="#D64545"
                            fontWeight="600"
                          >
                            {entry.delta}
                          </Text>
                        </>
                      )}
                    </Td>

                    <Td {...bodyCellProps()}>
                      {formattedDate} {formattedTime}
                    </Td>

                    <Td {...bodyCellProps(false)}>
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
