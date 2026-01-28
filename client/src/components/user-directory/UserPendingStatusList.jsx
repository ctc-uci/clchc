import { useContext, useEffect, useState } from "react";
import { Badge, Box, Flex, Text, Button, Avatar, VStack, HStack} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons"; 
import { BackendContext } from "@/contexts/BackendContext";

export const UserPendingStatusList = () => {
    const { backend } = useContext(BackendContext);
    const [pendingUsers, setPendingUsers] = useState([]);

    //Fetch users and check for pending status
    useEffect(() => {
        const checkPendingStatus = async () => {
            try {
                // Fetch all users that have pending status
                const response = await backend.get(`/users`);
                const userData = response.data;

                const pending = userData.filter(
                    (user) => user.status?.toLowerCase() === "pending"
                );

                setPendingUsers(pending);

            } catch (err) {
                console.error(
                    "couldn't fetch pending status in components/UserPendingStatus.jsx",
                    err
                );
            }
        };

        checkPendingStatus();
    }, [backend]);

    //If a user is denied, remove them from the pending list
    const handleUserDenied = (userId) => {
        setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
    };

    //If the user is approved, remove them from the pending list and their status is now active
    //Redirect them to the Quota Tracking page
    const handleUserApproved = (userId) => {
        setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
    };

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
                    {/* Left */}
                    <HStack spacing={3} minW="260px">
                        <Avatar size="sm" />
                        <Box>
                            <Text fontWeight="medium">{req.name}</Text>
                            <Text fontSize="sm" color="gray.500">
                            {req.email}
                            </Text>
                        </Box>
                    </HStack>

                    {/* Date */}
                    <Text fontSize="sm" color="gray.500">
                    Requested {req.date}
                    </Text>

                    {/* Role */}
                    <Text fontSize="sm">{req.role}</Text>

                    {/* Actions */}
                    <HStack spacing={2}>
                        <Button size="sm" colorScheme="blackAlpha">
                            ✓ Approve
                        </Button>
                        <Button size="sm" variant="outline">
                            ✕ Deny
                        </Button>
                    </HStack>
                </Flex>
                ))}
            </VStack>
        </Box>
    );
};