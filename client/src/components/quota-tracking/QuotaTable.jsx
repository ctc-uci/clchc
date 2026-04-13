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

const QuotaTable = ({
  rows,
  loading,
  onRowsUpdate,
  onDisplayedProgressChange,
  role,
}) => {
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
          ) : (
            rows.map((row) => (
              <Tr
                key={row.id}
                bg={selectedRowId === row.id ? SELECTED_BG : undefined}
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
                    <ProgressBar
                      quota={row}
                      onDisplayedProgressChange={onDisplayedProgressChange}
                    />
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