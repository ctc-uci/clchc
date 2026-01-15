import { SearchIcon, EditIcon, CalendarIcon, AddIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Flex, HStack, Heading, Input, InputGroup, InputLeftElement, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, IconButton, Progress, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, Portal } from "@chakra-ui/react";
import { CustomCard } from "./customCard";
import InputMask from "react-input-mask";
import QuotaTable from "./quotaTable";

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

            <QuotaTable></QuotaTable>

        </Box>
    );
}