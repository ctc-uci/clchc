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

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

import ProgressBar from "./ProgressBar";
import QuotaDrawer from "./QuotaDrawer";

const QuotaTable = ({ rows, loading, onRowsUpdate }) => {
  const { backend } = useBackendContext();
  const [editingQuotaId, setEditingQuotaId] = useState(null);
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const onSave = async (id, newNote) => {
    const sanitizedNote = newNote.trim();

    try {
      await backend.put(`/quota/${id}`, { notes: sanitizedNote });
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
          <Box maxWidth="100px">
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
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Providers</Th>
            <Th>Location</Th>
            <Th>Type</Th>
            <Th>Progress</Th>
            <Th>Notes</Th>
            <Th></Th>
          </Tr>
        </Thead>

        <Tbody>
          {rows.map((row) => (
            <Tr key={row.id}>
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
                <ProgressBar quotaID={row.id} />
              </Td>

              {/* Notes */}
              <Td>
                <EditableNote
                  quotaId={row.id}
                  initialNote={row.notes}
                  onSave={onSave}
                ></EditableNote>
              </Td>

              {/* Edit */}
              <Td textAlign="right">
                <IconButton
                  aria-label="Edit quota"
                  icon={<EditIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingQuotaId(row.id);
                    onDrawerOpen();
                  }}
                />
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
