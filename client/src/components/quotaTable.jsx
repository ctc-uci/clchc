import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Badge,
  HStack,
} from "@chakra-ui/react";

const QuotaTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotas = async () => {
      try {
        const res = await fetch("http://localhost:3001/quota");
        const data = await res.json();
        console.log("QUOTA DATA:", data);
        setRows(data);
      } catch (err) {
        console.error("Failed to fetch quotas", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotas();
  }, []);

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
                  <Text fontWeight="medium">
                    Provider #{row.providerId}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {row.hours} hours
                  </Text>
                </Box>
              </Td>

              {/* Location */}
              <Td>
                <Badge px={3} py={1} borderRadius="full">
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
                  <Text textTransform="capitalize">
                    {row.appointmentType}
                  </Text>
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
                <Text color="gray.600" noOfLines={1}>
                  {row.notes}
                </Text>
              </Td>

              {/* Edit */}
              <Td textAlign="right">✎</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default QuotaTable;