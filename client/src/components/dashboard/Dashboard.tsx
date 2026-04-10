import { useEffect, useState } from "react";

import {
  Button,
  Link as ChakraLink,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { User } from "@/types/user";
import { Link } from "react-router-dom";

import { RoleSelect } from "./RoleSelect";

export const Dashboard = () => {
  const { logout, currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useUserContext();

  const [users, setUsers] = useState<User[] | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [backend]);

  return (
    <VStack
      spacing={8}
      sx={{ maxWidth: "100%", marginX: "auto" }}
    >
      <Heading>Dashboard</Heading>

      <VStack>
        <Text>
          Signed in as {currentUser?.email} (
          {role === "master" || role === "ccm" ? "Admin" : "User"})
        </Text>

        {role === "master" || role === "ccm" ? (
          <ChakraLink
            as={Link}
            to={"/admin"}
          >
            Go to Admin Page
          </ChakraLink>
        ) : null}
        <Button onClick={logout}>Sign out</Button>
      </VStack>

      <TableContainer
        sx={{
          overflowX: "auto",
        }}
      >
        <Table variant="simple">
          <TableCaption>Users</TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Email</Th>
              <Th>FirebaseUid</Th>
              <Th>Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users
              ? users.map((user, i) => (
                  <Tr key={i}>
                    <Td>{user.id}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.firebaseUid}</Td>
                    <Td>
                      <RoleSelect
                        user={user}
                        disabled={role !== "master" && role !== "ccm"}
                      />
                    </Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};
