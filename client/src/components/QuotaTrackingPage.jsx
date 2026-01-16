import { SearchIcon, EditIcon, CalendarIcon, AddIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Flex, HStack, Heading, Input, InputGroup, InputLeftElement, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, IconButton, Progress, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, Portal } from "@chakra-ui/react";
import { CustomCard } from "./customCard";

export const QuotaTracking = () => {
    return (
        <Box p={6} maxW="1200px" mx="auto">
            <Flex justify="space-between" align="flex-start" mb={6}>
                <Box>
                    <Flex align="flex-end" gap={2}>
                        <Heading size="lg">
                            Quota Tracking
                        </Heading>
                        <Badge colorScheme="yellow" borderRadius="full" px={2} py={0.5} fontSize="xs">
                            Master
                        </Badge>
                    </Flex>
                    <Text color="gray.500" mt={1}>
                        Monitor daily appointment progress across all providers
                    </Text>
                </Box>

                <Box flex="1" display="flex" justifyContent="flex-end">
                    <InputGroup w="19ch">
                        {/* <InputLeftElement pointerEvents="none">
                            <CalendarIcon />
                        </InputLeftElement> */}
                        <Input
                            textAlign="center"
                            type="date"
                            as={InputMask}
                            mask="99/99/9999"
                            placeholder="MM/DD/YYYY"
                            onChange={(e) => console.log('date input:', e.target.value)}
                        />
                    </InputGroup>
                </Box>

                <Button leftIcon={<AddIcon />} colorScheme="blue" ml={4}>
                    Create Quota
                </Button>
            </Flex>

            <Box overflowX="auto" py={4} mb={6}>
                <HStack spacing={4} minW="min-content">
                    <CustomCard title="Total Progress" body="5/12" height="12rem" width="14rem"/>
                    <CustomCard title="Completion Rate" body="73%" footer="Overall Progress" height="12rem" width="14rem"/>
                    <CustomCard title="Active Providers" body="9" footer="3 Locations" height="12rem" width="14rem"/>
                    <CustomCard title="Needs Attention" body="0" footer="Below 40% Progress" height="12rem" width="14rem"/>
                </HStack>
            </Box>

            <InputGroup maxW="400px" pb={6}>
                <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input placeholder="Search Providers" borderRadius="md"/>
            </InputGroup>

            <TableContainer borderWidth="1px" borderColor="gray.200" borderRadius="lg">
                <Table>
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>Providers</Th>
                            <Th>Location</Th>
                            <Th>Type</Th>
                            <Th>Progress</Th>
                            <Th>Notes</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>
                                <Flex direction="column" gap={1}>
                                    <Text fontWeight="medium">Dr. Seuss</Text>
                                    <Flex align="center" gap={1}>
                                        <Text fontSize="xs" color="gray.600">10:00 AM - 11:00 AM</Text>
                                    </Flex>
                                </Flex>
                            </Td>
                            <Td>
                                <Badge colorScheme="gray" borderRadius="full" px={2} py={0.5} fontSize="xs">Main Clinic</Badge>
                            </Td>
                            <Td>
                                <Badge colorScheme="yellow" borderRadius="full" px={2} py={0.5} fontSize="xs">In-Person</Badge>
                            </Td>
                            <Td><Progress value={80} colorScheme="gray"/></Td>
                            <Td>
                                <Popover trigger="hover">
                                    <PopoverTrigger>
                                        <Text noOfLines={1} cursor="pointer" _hover={{ textDecoration: "underline" }}>
                                            This is a sample paragraph that will...
                                        </Text>
                                    </PopoverTrigger>
                                    <Portal>
                                        <PopoverContent bg="white">
                                            <PopoverArrow />
                                            <PopoverBody>
                                                <Text>This is a sample paragraph that will be shown in this white text box on hover.</Text>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Portal>
                                </Popover>
                            </Td>
                            <Td>
                                <IconButton icon={<EditIcon />} size="sm" aria-label="Edit" />
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>
                                <Flex direction="column" gap={1}>
                                    <Text fontWeight="medium">Dr. Mango</Text>
                                    <Flex align="center" gap={1}>
                                        <Text fontSize="xs" color="gray.600">1:00 PM - 4:30 PM</Text>
                                    </Flex>
                                </Flex>
                            </Td>
                            <Td>
                                <Badge colorScheme="gray" borderRadius="full" px={2} py={0.5} fontSize="xs">Eastside Center</Badge>
                            </Td>
                            <Td>
                                <Badge colorScheme="green" borderRadius="full" px={2} py={0.5} fontSize="xs">Telehealth</Badge>
                            </Td>
                            <Td><Progress value={80} colorScheme="gray"/></Td>
                            <Td>
                                <Popover trigger="hover">
                                    <PopoverTrigger>
                                        <Text noOfLines={1} cursor="pointer" _hover={{ textDecoration: "underline" }}>
                                            This is a sample paragraph that will...
                                        </Text>
                                    </PopoverTrigger>
                                    <Portal>
                                        <PopoverContent bg="white">
                                            <PopoverArrow />
                                            <PopoverBody>
                                                <Text>This is a sample paragraph that will be shown in this white text box on hover.</Text>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Portal>
                                </Popover>
                            </Td>
                            <Td>
                                <IconButton icon={<EditIcon />} size="sm" aria-label="Edit" />
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>

        </Box>
    );
}