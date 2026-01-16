import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  IconButton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export default function UserTable({ users, onDelete}) {

  // different badge colors per role, can delete if dtm
  const roleColors = {
    master: "red",
    ccm: "green",
    ccs: "blue",
    viewer: "yellow",
  };

  return (
    <TableContainer borderWidth="1px" borderColor="gray.200" borderRadius="lg">
      <Table>
        <Thead bg="gray.50">
          <Tr>
            <Th>User</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>
                {user.firstName} {user.lastName}
              </Td>
              <Td>{user.email}</Td>
              <Td><Badge colorScheme={roleColors[user.role] || "gray"} borderRadius="full" px={2} py={0.5} fontSize="xs">{user.role}</Badge></Td>
              <Td>
                <Stack direction="row">
                  <IconButton
                    aria-label="Edit"
                    borderRadius="16px"
                    icon={<EditIcon />}
                  />
                  <IconButton
                    aria-label="Delete"
                    borderRadius="16px"
                    onClick={() => onDelete(user.id)}
                    icon={<DeleteIcon />}
                  />
                </Stack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
