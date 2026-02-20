import { useState } from "react";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

import UserEditModal from "./UserEditModal";

const SkeletonRows = () => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Tr key={i}>
          <Td>
            <Skeleton height="30px" />
          </Td>
          <Td>
            <Skeleton height="30px" />
          </Td>
          <Td>
            <Skeleton height="30px" />
          </Td>
          <Td>
            <HStack>
              <Skeleton boxSize="30px" />
              <Skeleton boxSize="30px" />
            </HStack>
          </Td>
        </Tr>
      ))}
    </>
  );
};

export default function UserTable({
  users = [],
  loading,
  onDelete,
  onUpdated,
}) {
  // console.log(users)
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

  return (
    <>
      <TableContainer
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="lg"
      >
        <Table sx={{ tableLayout: "fixed" }}>
          <Thead bg="gray.50">
            <Tr>
              <Th width="25%">User</Th>
              <Th width="25%">Email</Th>
              <Th width="25%">Role</Th>
              <Th width="25%">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <SkeletonRows />
            ) : (
              users.map((user) => (
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
              ))
            )}
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
