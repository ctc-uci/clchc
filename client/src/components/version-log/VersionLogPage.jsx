import { useState, useEffect } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";

import Navbar from "@/components/layout/Navbar";
import VersionLogTable from "@/components/version-log/VersionLogTable";
import { useVersionLogs } from "@/contexts/hooks/data-fetching/useVersionLogs";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";
import CalendarCard from "../common/CalendarCard";


export const VersionLogPage = () => {
  // const [logs, setLogs] = useState([]);
  // const { backend } = useBackendContext();
  const navigate = useNavigate();
  const { dateParam } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const today = new Date().toLocaleDateString("en-CA");
  const [selectedDate, setSelectedDate] = useState(
    dateParam || sessionStorage.getItem("logDate") || today
  );
  const debouncedSearchQuery = useDebounce(
    (value) => setSearchQuery(value),
    300
  );
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dateParam && dateParam !== selectedDate) {
      setSelectedDate(dateParam);
      sessionStorage.setItem("logDate", dateParam);
    }
  }, [dateParam]);

  useEffect(() => {
    sessionStorage.setItem("logDate", selectedDate);
  }, [selectedDate]);

  const { data: logs = [], isLoading } = useVersionLogs({
    date: selectedDate,
    q: searchQuery,
  });

  // handleChange
  const handleChange = (e) => {
    debouncedSearchQuery(e.target.value);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    navigate(`/version-log/${newDate}`);
  };
  // console.log("Selected Date:", selectedDate);
  return (
    <Box
      p={6}
      maxW="1200px"
      mx="auto"
    >
      <Flex
        justify="space-between"
        align="flex-start"
        mb={6}
      >
        <Box>
          <Flex
            align="flex-end"
            gap={2}
          >
            <Heading size="lg">Version Log</Heading>
            <Badge
              colorScheme="yellow"
              borderRadius="full"
              px={2}
              py={0.5}
              fontSize="xs"
            >
              Master
            </Badge>
          </Flex>
          <Text
            color="gray.500"
            mt={1}
          >
            View action history over given day
          </Text>
        </Box>
        <Box
          flex="1"
          display="flex"
          justifyContent="flex-end"
        >
          <CalendarCard
            value={selectedDate}
            onChange={handleDateChange}
          />
        </Box>

      </Flex>

      <Stack gap={2}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search Version Log"
            borderRadius="md"
            onChange={handleChange}
          />
        </InputGroup>
        <VersionLogTable
          loading={isLoading}
          logs={logs}
          selectedDate={selectedDate}
        />
      </Stack>
      <Navbar />
    </Box>
  );
};
