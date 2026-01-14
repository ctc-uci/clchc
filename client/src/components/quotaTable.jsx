import { useEffect, useState } from "react";

import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  HStack,
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
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

const QuotaTable = () => {
  const { backend } = useBackendContext();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotas = async () => {
      try {
        const response = await backend.get("/quota");
        console.log("QUOTA DATA:", response.data);
        setRows(response.data);
      } catch (err) {
        console.error("Failed to fetch quotas", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotas();
  }, [backend]);

  const onSave = async (id, newNote) => {
    try {
      await backend.put(`/quota/${id}`, { notes: newNote });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, notes: newNote } : row
        )
      );
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
                  <Text fontWeight="medium">Provider #{row.providerId}</Text>
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
                  Location {row.locationId}
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
                <HStack spacing={2}>
                  <Text>
                    {row.progress}/{row.quota}
                  </Text>
                </HStack>
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
              <Td>
                <IconButton
                  aria-label="Edit"
                  borderRadius="16px"
                  icon={<EditIcon />}
                ></IconButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default QuotaTable;
