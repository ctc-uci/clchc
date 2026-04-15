import { useEffect, useRef, useState } from "react";

import {
  Badge,
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
  useDisclosure,
} from "@chakra-ui/react";

import { MdSentimentDissatisfied } from "react-icons/md";

import TextPopup from "@/components/common/TextPopup";
import ProgressBar from "@/components/quota-tracking/ProgressBar";
import QuotaDrawer from "@/components/quota-tracking/QuotaDrawer";

const SELECTED_BG = "#EDF2F7";

const SkeletonRows = () => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Tr key={i} borderBottom="1px solid" borderColor="gray.200">
          {Array.from({ length: 5 }, (_, j) => (
            <Td key={j} borderRight="1px solid" borderColor="gray.200">
              <Skeleton height="40px" />
            </Td>
          ))}
        </Tr>
      ))}
    </>
  );
};

const QuotaTable = ({ rows, loading, onRowsUpdate, role }) => {
  const isViewer = role === "viewer";
  const [editingQuotaId, setEditingQuotaId] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const tableRef = useRef(null);
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  function formatHoursRange(startTime, endTime) {
  const fmt = (t) => {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "pm" : "am";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${m.toString().padStart(2, "0")}${period}`;
  };
  return `${fmt(startTime)} to ${fmt(endTime)}`;
}
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target) &&
        !isDrawerOpen
      ) {
        setSelectedRowId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

  const thProps = {
    fontFamily: "Inter",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "16px",
    letterSpacing: "0.6px",
    padding: "15px 25px",
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

  return (
    <TableContainer
      ref={tableRef}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
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
          h="40px"
          zIndex={1}
        >
          <Tr>
            <Th {...thProps}>Providers</Th>
            <Th {...thProps}>Location</Th>
            <Th {...thProps}>Type</Th>
            <Th {...thProps}>Progress</Th>
            <Th {...thProps} borderRight="none">Notes</Th>
          </Tr>
        </Thead>

        <Tbody>
          {loading ? (
            <SkeletonRows />
          ) : rows.length === 0 ? (
            <Tr>
              <Td colSpan={5} height={"240px"} textAlign="center" py={10}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <MdSentimentDissatisfied size={69} color="#586771" />
                  <Text fontFamily="Lato" fontSize="18px" color="gray.500">
                    No quotas found.
                  </Text>
                </Box>
              </Td>
            </Tr>
          ) : (
            rows.map((row) => (
              <Tr
                key={row.id}
                sx={selectedRowId === row.id ? { background: `${SELECTED_BG} !important` } : undefined}
                borderBottom="1px solid"
                borderColor="gray.200"
                onClick={() => {
                  if (isViewer) return;
                  if (selectedRowId === row.id) {
                    setEditingQuotaId(row.id);
                    onDrawerOpen();
                  } else {
                    setSelectedRowId(row.id);
                  }
                }}
                cursor="pointer"
                _hover={{ bg: selectedRowId === row.id ? SELECTED_BG : "gray.50" }}
              >
                {/* Provider */}
                <Td {...tdProps}>
                  <Text {...tdTextProps}>{row.providerName}</Text>
                </Td>

                {/* Location */}
                <Td {...tdProps}>
                  {row.locationName ? (
                    <Badge
                      px={3}
                      py={1}
                      fontWeight={0}
                      fontSize="14px"
                      textTransform="none"
                      bgColor="#35639D"
                      textColor="white"
                      borderRadius="6px"
                    >
                      {row.locationName}
                    </Badge>
                  ) : (
                    <Text
                      color="gray.400"
                      fontFamily="Inter"
                      fontSize="14px"
                      fontStyle="normal"
                      fontWeight="400"
                      lineHeight="22px"
                    >
                      NO LOCATION SELECTED
                    </Text>
                  )}
                </Td>

                {/* Type */}
                <Td {...tdProps}>
                  <Badge
                    px={3}
                    py={1}
                    fontWeight={0}
                    fontSize="14px"
                    textTransform="none"
                    bgColor="#35639D"
                    textColor="white"
                    borderRadius="6px"
                  >
                    <Text textTransform="capitalize">{row.appointmentType}</Text>
                  </Badge>
                </Td>

                {/* Progress */}
                <Td {...tdProps} padding="16px 24px">
                  <Box onClick={(e) => e.stopPropagation()}>
                    <ProgressBar quota={row} />
                  </Box>
                </Td>

                {/* Notes */}
                <Td {...tdProps}>
                  {!row.notes ? (
                    <Text {...tdTextProps} color="gray.500">No notes.</Text>
                  ) : row.notes.length > 200 ? (
                    <TextPopup
                      text={row.notes}
                      alwaysShowPopup={true}
                      truncateAt={200}
                    />
                  ) : (
                    <Text {...tdTextProps} color="gray.500">{row.notes}</Text>
                  )}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      <QuotaDrawer
        quotaID={editingQuotaId || 0}
        isOpen={isDrawerOpen}
        onOpen={onDrawerOpen}
        onClose={() => {
          setEditingQuotaId(null);
          setSelectedRowId(null);
          onDrawerClose();
          if (onRowsUpdate) {
            // Trigger parent to refetch by passing a non-function value
            onRowsUpdate(null);
          }
        }}
      />
    </TableContainer>
  );
};

export default QuotaTable;
