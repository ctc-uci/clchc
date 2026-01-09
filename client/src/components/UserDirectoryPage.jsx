import { SearchIcon, InfoOutlineIcon, DeleteIcon, EditIcon, CalendarIcon } from "@chakra-ui/icons";
import { Badge, Box, Flex, HStack, Heading, Input, InputGroup, InputLeftElement, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, IconButton, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody } from "@chakra-ui/react";
import { CustomCard } from "./customCard";

export const UserDirectory = () => {

    return (
        <Box p={6} maxW="1200px" mx="auto">
            <Flex justify="space-between" align="flex-start" mb={6}>
                <Box>
                    <Flex align="flex-end" gap={2}>
                        <Heading size="lg">
                            User Directory
                        </Heading>
                        <Badge colorScheme="yellow" borderRadius="full" px={2} py={0.5} fontSize="xs">
                            Master
                        </Badge>
                    </Flex>
                    <Text color="gray.500" mt={1}>
                        Manage user accounts and permissions
                    </Text>
                </Box>

                <Box>
                    <Popover placement="bottom-end">
                        <PopoverTrigger>
                            <IconButton icon={<CalendarIcon />} aria-label="Select date" />
                        </PopoverTrigger>
                        <PopoverContent width="auto">
                            <PopoverArrow />
                            <PopoverBody>
                                <Input type="date" onChange={(e) => setSelectedDate(e.target.value)} />
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </Box>
            </Flex>

            <Box borderWidth="1px" borderColor="yellow.300" bg="yellow.50" borderRadius="lg" p={4} mb={8}>
                <Flex align="center" gap={2}>
                    <InfoOutlineIcon></InfoOutlineIcon>
                    <Text fontWeight="medium" color="gray.700">
                        Pending Requests
                    </Text>
                    <Badge borderRadius="full" px={1.5} py={0.3} colorScheme="red" variant="solid">2</Badge>
                </Flex>
            </Box>

            <Heading size="sm" mb={0} color="gray.600">
                User Statistics
            </Heading>

            <Box overflowX="auto" py={4} mb={6}>
                <HStack spacing={4} minW="min-content">
                    <CustomCard title="Total Users" body="5" />
                    <CustomCard title="Managers" body="2" footer="hello"/>
                    <CustomCard title="Staff" body="2"/>
                    <CustomCard title="Viewers" body="1"/>
                </HStack>
            </Box>

            <InputGroup maxW="400px" pb={6}>
                <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input placeholder="Search by name or email..." borderRadius="md"/>
            </InputGroup>

            <TableContainer borderWidth="1px" borderColor="gray.200" borderRadius="lg">
                <Table>
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>User</Th>
                            <Th>Email</Th>
                            <Th>Role</Th>
                            <Th>Last Active</Th>
                            <Th></Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>
                                <Flex direction="column" gap={1}>
                                    <Text fontWeight="medium">Baby Saja</Text>
                                    <Flex align="center" gap={1}>
                                        <Box w={1.5} h={1.5} borderRadius="full" bg="green.600" />
                                        <Text fontSize="xs" color="green.600">Active</Text>
                                    </Flex>
                                </Flex>
                            </Td>
                            <Td>baby@saja.com</Td>
                            <Td>Manager</Td>
                            <Td>2 hours ago</Td>
                            <Td>
                                <IconButton icon={<EditIcon />} size="sm" aria-label="Edit" />
                            </Td>
                            <Td>
                                <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" aria-label="Delete" />
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>
                                <Flex direction="column" gap={1}>
                                    <Text fontWeight="medium">Allison Huang</Text>
                                    <Flex align="center" gap={1}>
                                        <Box w={1.5} h={1.5} borderRadius="full" bg="red.600" />
                                        <Text fontSize="xs" color="red.600">Inactive</Text>
                                    </Flex>
                                </Flex>
                            </Td>
                            <Td>allish11@uci.edu</Td>
                            <Td>Staff</Td>
                            <Td>67 days ago</Td>
                            <Td>
                                <IconButton icon={<EditIcon />} size="sm" aria-label="Edit" />
                            </Td>
                            <Td>
                                <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" aria-label="Delete" />
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>

        </Box>
  );
};
