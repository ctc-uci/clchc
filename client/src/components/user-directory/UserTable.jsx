import { useState } from "react";

// import { Icon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  HStack,
  IconButton,
  Skeleton,
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

import { MdCreate, MdSentimentDissatisfied } from "react-icons/md";

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

// const CustomDeleteIcon = (props) => (
//   <Icon
//     viewBox="0 0 24 24"
//     fill="none"
//     {...props}
//   >
//     <path
//       d="M9 3h6l1 2h5v2H3V5h5l1-2Zm1 7h2v9h-2v-9Zm4 0h2v9h-2v-9ZM7 10h2v9H7v-9Zm1-2h8l-1 13H9L8 8Z"
//       fill="currentColor"
//     />
//   </Icon>
// );

const thProps = {
  fontFamily: "Inter",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: "700",
  lineHeight: "16px",
  letterSpacing: "0.6px",
  padding: "15px 25px",
  backgroundColor: "#C8D4E6",
  color: "#113D64",
  borderRight: "1px solid",
  borderColor: "gray.200",
};

const tdProps = {
  borderRight: "1px solid",
  borderColor: "gray.200",
  padding: "16px 24px",
};

const tdTextProps = {
  fontFamily: "Lato",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "20px",
  color: "#2D3748",
};

const SkeletonRows = () => (
  <>
    {Array.from({ length: 5 }, (_, i) => (
      <Tr key={i} borderBottom="1px solid" borderColor="gray.200">
        <Td borderRight="1px solid" borderColor="gray.200">
          <Skeleton height="20px" />
        </Td>
        <Td borderRight="1px solid" borderColor="gray.200">
          <Skeleton height="20px" />
        </Td>
        <Td borderRight="1px solid" borderColor="gray.200">
          <Skeleton height="20px" />
        </Td>
        <Td>
          <HStack>
            <Skeleton boxSize="30px" borderRadius="md" />
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
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleEditClick = (user) => {
    setSelectedUserId(user.id);
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
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        overflowY="auto"
      >
        <Table
          sx={{
            "tbody tr:nth-of-type(odd)": { bg: "white" },
            "tbody tr:nth-of-type(even)": { bg: "#F9F9F9" },
          }}
        >
          <Thead position="sticky" top={0} h="40px" zIndex={1}>
            <Tr>
              <Th {...thProps}>Users</Th>
              <Th {...thProps}>Email</Th>
              <Th {...thProps} textAlign="center">Role</Th>
              <Th {...thProps} borderRight="none" w="90px"></Th>
            </Tr>
          </Thead>

          <Tbody>
            {loading ? (
              <SkeletonRows />
            ) : users.length === 0 ? (
              <Tr>
                <Td colSpan={4} height={"360px"} textAlign="center" py={10}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <MdSentimentDissatisfied size={69} color="#586771" />
                    <Text fontFamily="Lato" fontSize="18px" color="gray.500">
                      No users found.
                    </Text>
                  </Box>
                </Td>
              </Tr>
            ) : (
              users.map((user) => (
                <Tr key={user.id} borderBottom="1px solid" borderColor="gray.200">
                  <Td {...tdProps}>
                    <Text {...tdTextProps}>
                      {user.firstName} {user.lastName}
                    </Text>
                  </Td>
                  <Td {...tdProps}>
                    <Text {...tdTextProps}>{user.email}</Text>
                  </Td>
                  <Td {...tdProps} textAlign="center">
                    <Badge
                      bg={roleColors[user.role]?.bg || "gray.200"}
                      color={roleColors[user.role]?.color || "white"}
                      borderRadius="6px"
                      px="6px"
                      py="2px"
                      fontSize="14px"
                      fontStyle="normal"
                      fontWeight="400"
                      lineHeight="16px"
                      textTransform={
                        user.role === "viewer" || user.role === "master"
                          ? "capitalize"
                          : "uppercase"
                      }
                    >
                      {user.role}
                    </Badge>
                  </Td>
                  <Td {...tdProps} borderRight="none">
                    <Stack direction="row">
                      <IconButton
                        aria-label="Edit"
                        variant="ghost"
                        size="sm"
                        borderRadius="16px"
                        icon={<MdCreate size={18} color="#00000040" />}
                        onClick={() => handleEditClick(user)}
                      />
                    </Stack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {selectedUserId && (
        <UserEditModal
          isOpen={isOpen}
          onClose={() => {
            setSelectedUserId(null);
            onClose();
          }}
          userId={selectedUserId}
          onUpdated={onUpdated}
        />
      )}
    </>
  );
}
