import { useContext, useEffect, useState } from "react";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Stack,
  Table,
  //   TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  //   Tfoot,
  Tr,
} from "@chakra-ui/react";

import { BackendContext } from "../contexts/BackendContext";

export default function UserTable() {
  const { backend } = useContext(BackendContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await backend.get("/users-js");
        console.log(data);
        setUsers(data);
      } catch (err) {
        console.error("Could not fetch users", err);
      }
    };

    fetchUsers();
  }, [backend]);

  const handleDelete = async (id) => {
    try {
      await backend.delete(`/users-js/${id}`);
      // optimistically update ui, loop through array and filter out user that matches the id
      setUsers((users) => users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Could not delete user", err);
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>
                  {" "}
                  {user.firstName} {user.lastName}{" "}
                </Td>
                <Td> {user.email} </Td>
                <Td> {user.role} </Td>
                <Td>
                  <Stack direction="row">
                    <IconButton
                      aria-label="Edit"
                      borderRadius="16px"
                      icon={<EditIcon />}
                    ></IconButton>
                    <IconButton
                      aria-label="Delete"
                      borderRadius="16px"
                      onClick={() => handleDelete(user.id)}
                      icon={<DeleteIcon />}
                    ></IconButton>
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
