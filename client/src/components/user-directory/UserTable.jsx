import { useState } from "react";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  IconButton,
  Stack,
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

import UserEditModal from "./UserEditModal";

export default function UserTable({
  users = [],
  loading = false,
  onDelete,
  onUpdated,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  // different badge colors per role, can delete if dtm
  const roleColors = {
    master: "red",
    ccm: "green",
    ccs: "blue",
    viewer: "yellow",
  };

  if (loading) {
    return <Text> Loading users... </Text>;
  }
  return (
    <>
      <TableContainer
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="lg"
      >
        <Table
          variant="striped"
          colorScheme="gray"
          sx={{
            "th, td": { borderRight: "1px solid", borderColor: "gray.200" },
          }}
        >
          <Thead bg="gray.50">
            <Tr>
              <Th
                borderRight="1px solid"
                borderColor="gray.200"
              >
                User
              </Th>
              <Th
                borderRight="1px solid"
                borderColor="gray.200"
              >
                Email
              </Th>
              <Th
                borderRight="1px solid"
                borderColor="gray.200"
              >
                Role
              </Th>
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
                <Td>
                  <Badge
                    colorScheme={roleColors[user.role] || "gray"}
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    fontSize="xs"
                  >
                    {user.role}
                  </Badge>
                </Td>
                <Td>
                  <Stack direction="row">
                    <IconButton
                      aria-label="Edit"
                      borderRadius="16px"
                      icon={<EditIcon />}
                      onClick={() => handleEditClick(user)}
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
      {selectedUser && (
        <UserEditModal
          isOpen={isOpen}
          onClose={() => {
            setSelectedUser(null);
            onClose();
          }}
          user={selectedUser}
          onUpdated={onUpdated}
        />
      )}
    </>
  );
}
