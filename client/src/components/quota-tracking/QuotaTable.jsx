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
        <Tr key={i}>
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
          <Td>
            <Skeleton height="30px" />
          </Td>
          <Td>
            <Box
              display="flex"
              flexDirection="row"
              gap="2px"
            >
              <Skeleton
                height="30px"
                width="20%"
              />
              <Skeleton
                height="30px"
                width="60%"
              />
              <Skeleton
                height="30px"
                width="20%"
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

  return (
    <TableContainer
      ref={tableRef}
      borderRadius="5px"
      maxHeight="60vh"
      overflowY="auto"
    >
      <Table
        variant="simple"
        sx={{
          "td, th": { borderBottom: "none" },
        }}
      >
        <Thead bg="#C8D4E6"
        position="sticky"
        top={0}
        h="40px"
        zIndex={1}>
          <Tr>
            <Th textColor="#113D64">Providers</Th>
            <Th textColor="#113D64">Location</Th>
            <Th textColor="#113D64">Type</Th>
            <Th textColor="#113D64">Progress</Th>
            <Th textColor="#113D64">Notes</Th>
          </Tr>
        </Thead>

        <Tbody>
          {loading ? (
            <SkeletonRows />
          ) : (
            rows.map((row, index) => (
              <Tr
                key={row.id}
                bg={selectedRowId === row.id ? SELECTED_BG : index % 2 === 0 ? "#FFF" : "#F9F9F9"}
                border="1.5px solid rgba(0, 0, 0, 0.06)"
                onClick={() => {
                  if (isViewer) return;
                  if (selectedRowId === row.id) {
                    // Second click - open drawer
                    setEditingQuotaId(row.id);
                    onDrawerOpen();
                  } else {
                    // First click - highlight
                    setSelectedRowId(row.id);
                  }
                }}
                cursor={isViewer ? "default" : "pointer"}
                transition="background-color 0.2s"
                _hover={{
                  bg: selectedRowId === row.id ? SELECTED_BG : "gray.50",
                }}
              >
                {/* Provider */}
                <Td border="1.5px solid rgba(0, 0, 0, 0.06)">
                  <Box>
                    <Text fontWeight="normal" fontSize={"14px"}>{row.providerName}</Text>
                  </Box>
                </Td>

                {/* Location */}
                <Td padding="16px 24px" border="1.5px solid rgba(0, 0, 0, 0.06)">
                  <Badge
                    px={3}
                    py={1}
                    fontWeight={0}
                    fontSize={"14px"}
                    textTransform="none"
                    bgColor={"#35639D"}
                    textColor={"white"}
                    borderRadius="6px"
                  >
                    {row.locationName}
                  </Badge>
                </Td>

                {/* Type */}
                <Td padding="16px 24px" border="1.5px solid rgba(0, 0, 0, 0.06)">
                  <Badge
                    px={3}
                    py={1}
                    fontWeight={0}
                    fontSize={"14px"}
                    textTransform="none"
                    bgColor={"#35639D"}
                    textColor={"white"}
                    borderRadius="6px"
                  >
                    <Text textTransform="capitalize">
                      {row.appointmentType}
                    </Text>
                  </Badge>
                </Td>

                {/* Progress */}
                <Td
                  px={2}
                  py={34.5}
                  border="1.5px solid rgba(0, 0, 0, 0.06)"
                  padding="16px 24px" 
                >
                  <Box onClick={(e) => e.stopPropagation()}>
                    <ProgressBar quota={row} />
                  </Box>
                </Td>

                {/* Notes */}
                <Td padding="16px 24px" border="1.5px solid rgba(0, 0, 0, 0.06)">
                  {!row.notes ? (
                    <Text color="#718096" fontSize="14px" fontWeight="400" lineHeight="30px">No notes.</Text>
                  ) : row.notes.length > 200 ? (
                    <TextPopup
                      text={row.notes}
                      alwaysShowPopup={true}
                      truncateAt={200}
                    />
                  ) : (
                    <Text textColor={"#718096"}>{row.notes}</Text>
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