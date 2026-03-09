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

const QuotaTable = ({ rows, loading, onRowsUpdate }) => {
  const [editingQuotaId, setEditingQuotaId] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const tableRef = useRef(null);
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

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
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
    >
      <Table
        variant="simple"
        sx={{ tableLayout: "fixed" }}
      >
        <Thead bg="gray.50">
          <Tr>
            <Th width="20%">Providers</Th>
            <Th width="20%">Location</Th>
            <Th width="20%">Type</Th>
            <Th width="20%">Progress</Th>
            <Th width="20%">Notes</Th>
          </Tr>
        </Thead>

        <Tbody>
          {loading ? (
            <SkeletonRows />
          ) : (
            rows.map((row) => (
              <Tr
                key={row.id}
                bg={selectedRowId === row.id ? SELECTED_BG : "transparent"}
                onClick={() => {
                  if (selectedRowId === row.id) {
                    // Second click - open drawer
                    setEditingQuotaId(row.id);
                    onDrawerOpen();
                  } else {
                    // First click - highlight
                    setSelectedRowId(row.id);
                  }
                }}
                cursor="pointer"
                transition="background-color 0.2s"
                _hover={{
                  bg: selectedRowId === row.id ? SELECTED_BG : "gray.50",
                }}
              >
                {/* Provider */}
                <Td>
                  <Box>
                    <Text fontWeight="medium">{row.providerName}</Text>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                    >
                      {row.hours} hours
                    </Text>
                  </Box>
                </Td>

                {/* Location */}
                <Td>
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {row.locationName}
                  </Badge>
                </Td>

                {/* Type */}
                <Td>
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
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
                >
                  <Box onClick={(e) => e.stopPropagation()}>
                    <ProgressBar quota={row} />
                  </Box>
                </Td>

                {/* Notes */}
                <Td>
                  {row.notes && row.notes.length > 200 ? (
                    <TextPopup
                      text={row.notes}
                      alwaysShowPopup={true}
                      truncateAt={200}
                    />
                  ) : (
                    <Text>{row.notes}</Text>
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
