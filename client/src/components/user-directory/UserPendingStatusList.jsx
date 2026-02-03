import { useContext, useEffect, useState } from "react";
import { Badge, Box, Flex, Text, Button, Avatar, VStack, HStack} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons"; 
import { useUsers, useUpdateUser, useDeleteUser } from "../../../contexts/hooks/data-fetching/useUsers";

export const UserPendingStatusList = () => {
    // const [pendingUsers, setPendingUsers] = useState([]);
    const { data: pendingUsers, isLoading, error } = useUsers({ status: "pending" });
    const { mutate: updateUser, isLoading: isUpdating, error: errorUpdating } = useUpdateUser()
    const { mutate: deleteUser, isLoading: isDeleting, error: errorDeleting } = useDeleteUser()

    //When Approve Button is clicked, update user status to active
    const handleApprove = async (id) => {
    try {
        await updateUser({id: id, data: { status: "approved" }})
    } catch (err) {
        console.error("Couldn't approve user", err);
    }
    };
    
    //When Deny Button is clicked, delete user from database
    const handleDeny = async (id) => {
        try {
            await deleteUser(id)
        } catch (err) {
            console.error(
                "couldn't deny user in components/UserPendingStatus.jsx",
                err
            );
        }
    };

    if (isLoading) {
        return <div> Loading pending users... </div>
    }

    return (
        <Box
            bg="#FFF8E6"
            borderRadius="lg"
            p={6}
            border="1px solid"
            borderColor="yellow.200"
        >
            <Flex align="center" mb={4}>
                <WarningIcon color="orange.400" mr={2} />
                <Text fontWeight="semibold">Pending Requests</Text>
                <Badge
                    ml={2}
                    colorScheme="red"
                    borderRadius="full"
                    px={2}
                >
                {pendingUsers.length}
                </Badge>
            </Flex>

            <VStack spacing={3} align="stretch">
                {pendingUsers.map((req) => (
                <Flex
                    key={req.id}
                    bg="white"
                    p={4}
                    borderRadius="md"
                    align="center"
                    justify="space-between"
                    boxShadow="sm"
                >
                    {/* Placeholder Icon */}
                    <WarningIcon />
                    {/* Left */}
                    <HStack spacing={3} minW="260px">
                        <Avatar size="sm" />
                        <Box>
                            <Text fontWeight="medium">{req.firstName} {req.lastName}</Text>
                            <Text fontSize="sm" color="gray.500">
                            {req.email}
                            </Text>
                        </Box>
                    </HStack>

                    {/* Date */}
                    <Text fontSize="sm" color="gray.500">
                        Request Date
                    </Text>

                    {/* Role */}
                    <Text fontSize="sm">{req.role}</Text>

                    {/* Actions */}
                    <HStack spacing={2}>
                        <Button size="sm" colorScheme="blackAlpha" onClick={() => handleApprove(req.id)}>
                            ✓ Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeny(req.id)}>
                            ✕ Deny
                        </Button>
                    </HStack>
                </Flex>
                ))}
            </VStack>
        </Box>
    );
};