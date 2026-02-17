import { useState } from "react";

import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

import ProgressBar from "@/components/quota-tracking/ProgressBar";
import QuotaDrawer from "@/components/quota-tracking/QuotaDrawer";
import { useUpdateQuota } from "@/contexts/hooks/data-fetching/useQuotas";

const SELECTED_BG = "#7fb3ec";

const QuotaTable = ({ rows, loading, onRowsUpdate }) => {
  const [editingQuotaId, setEditingQuotaId] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    mutate: updateQuota,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateQuota();

  const onSave = async (id, newNote) => {
    const sanitizedNote = newNote.trim();

    try {
      updateQuota({ id, data: { notes: sanitizedNote } });
      if (onRowsUpdate) {
        onRowsUpdate((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, notes: sanitizedNote } : row
          )
        );
      }
    } catch (err) {
      console.error("Could not update note", err);
    }
  };

  const EditableNote = ({ quotaId, initialNote, onSave }) => {
    const [tempNote, setTempNote] = useState(initialNote);

    return (
      <Popover trigger="click">
        <PopoverTrigger>
          <Box
            maxWidth="100px"
            onClick={(e) => e.stopPropagation()}
          >
            <Text
              isTruncated
              textDecoration="underline"
              textUnderlineOffset="3px"
              color="gray.600"
              noOfLines={1}
            >
              {initialNote}
            </Text>
          </Box>
        </PopoverTrigger>
        <Portal>
          <PopoverContent bg="white">
            <PopoverArrow />
            <PopoverBody>
              <Textarea
                size="lg"
                width="100%"
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
              ></Textarea>
              <IconButton
                aria-label="Save"
                borderRadius="16px"
                icon={<CheckIcon />}
                onClick={() => onSave(quotaId, tempNote)}
              ></IconButton>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <TableContainer
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
    >
      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>Providers</Th>
            <Th>Location</Th>
            <Th>Type</Th>
            <Th>Progress</Th>
            <Th>Notes</Th>
          </Tr>
        </Thead>

        <Tbody>
          {rows.map((row) => (
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
                  <Text textTransform="capitalize">{row.appointmentType}</Text>
                </Badge>
              </Td>

              {/* Progress */}
              <Td>
                <Box onClick={(e) => e.stopPropagation()}>
                  <ProgressBar quotaID={row.id} />
                </Box>
              </Td>

              {/* Notes */}
              <Td>
                <EditableNote
                  quotaId={row.id}
                  initialNote={row.notes}
                  onSave={onSave}
                ></EditableNote>
              </Td>
            </Tr>
          ))}
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
