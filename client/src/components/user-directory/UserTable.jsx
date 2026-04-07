import { useState } from "react";

import { Icon, SearchIcon } from "@chakra-ui/icons";
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

import { MdCreate } from "react-icons/md";

import UserEditModal from "./UserEditModal";

// const CustomEditIcon = (props) => (
//   <Icon
//     viewBox="0 0 24 24"
//     fill="none"
//     {...props}
//   >
//     <path
//       d="M2.99219 17.1999V20.9391H6.73144L17.7597 9.91082L14.0205 6.17157L2.99219 17.1999ZM20.6514 7.01913C20.7438 6.92689 20.8172 6.81731 20.8672 6.69669C20.9173 6.57606 20.943 6.44675 20.943 6.31616C20.943 6.18556 20.9173 6.05625 20.8672 5.93563C20.8172 5.815 20.7438 5.70543 20.6514 5.61318L18.3181 3.27989C18.2259 3.18745 18.1163 3.11411 17.9957 3.06407C17.875 3.01404 17.7457 2.98828 17.6151 2.98828C17.4845 2.98828 17.3552 3.01404 17.2346 3.06407C17.114 3.11411 17.0044 3.18745 16.9122 3.27989L15.0874 5.10464L18.8267 8.84389L20.6514 7.01913Z"
//       fill="gray"
//     />
//   </Icon>
// );

const CustomDeleteIcon = (props) => (
  <Icon
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M9 3h6l1 2h5v2H3V5h5l1-2Zm1 7h2v9h-2v-9Zm4 0h2v9h-2v-9ZM7 10h2v9H7v-9Zm1-2h8l-1 13H9L8 8Z"
      fill="currentColor"
    />
  </Icon>
);

const SkeletonRows = () => (
  <>
    {Array.from({ length: 5 }, (_, i) => (
      <Tr key={i}>
        <Td>
          <Skeleton height="20px" />
        </Td>
        <Td>
          <Skeleton height="20px" />
        </Td>
        <Td>
          <Skeleton height="20px" />
        </Td>
        <Td>
          <HStack>
            <Skeleton
              boxSize="30px"
              borderRadius="md"
            />
            <Skeleton
              boxSize="30px"
              borderRadius="md"
            />
          </HStack>
        </Td>
      </Tr>
    ))}
  </>
);

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

  const roleColors = {
    master: { bg: "#573D59", color: "white" },
    ccm: { bg: "#07B8AC", color: "white" },
    ccs: { bg: "#3498DB", color: "white" },
    viewer: { bg: "#C8D4E6", color: "gray.800" },
  };

  return (
    <>
      <TableContainer
        borderWidth="1px"
        borderColor="blackAlpha.100"
        borderRadius="sm"
        maxHeight="60vh"
        overflowY="auto"
        css={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Table
          colorScheme="gray"
          sx={{
            "th, td": {
              borderRight: "1px solid",
              borderColor: "blackAlpha.100",
              borderBottom: "none",
            },
            "th:last-child, td:last-child": {
              borderRight: "none",
            },
            "tbody tr:nth-of-type(odd)": {
              bg: "transparent",
            },
            "tbody tr:nth-of-type(even)": {
              bg: "#F9F9F9",
            },
          }}
        >
          <Thead
            bg="#C8D4E6"
            position="sticky"
            top={0}
            h="40px"
            zIndex={1}
            borderRadius="0 4px 0 0"
            color="var(--gray-700, #2D3748);"
          >
            <Tr>
              <Th width="42.5%">Users</Th>
              <Th width="42.5%">Email</Th>
              <Th
                width="10%"
                textAlign="center"
              >
                Role
              </Th>
              <Th
                width="5%"
                align="center"
              ></Th>
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
                  <Td textAlign="center">
                    <Badge
                      bg={roleColors[user.role]?.bg || "gray.200"}
                      color={roleColors[user.role]?.color || "white"}
                      borderRadius="6px"
                      px="2px"
                      py="6px"
                      fontSize="14px"
                      fontStyle="normal"
                      fontWeight="400"
                      lineHeight="16px"
                      p="2px 6px"
                      textTransform={
                        user.role === "viewer" || user.role === "master"
                          ? "capitalize"
                          : "uppercase"
                      }
                    >
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <Stack direction="row">
                      <IconButton
                        aria-label="Edit"
                        variant="ghost"
                        borderRadius="16px"
                        icon={
                          <MdCreate
                            size={24}
                            color="#00000040"
                          />
                        }
                        onClick={() => handleEditClick(user)}
                      />
                      {/* {onDelete && (
                        <IconButton
                          aria-label="Delete"
                          variant="ghost"
                          borderRadius="16px"
                          icon={<CustomDeleteIcon />}
                          onClick={() => onDelete(user.id)}
                        />
                      )} */}
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
