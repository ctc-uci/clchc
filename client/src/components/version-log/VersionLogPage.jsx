import { useState, useEffect } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Badge,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
} from "@chakra-ui/react";

import VersionLogTable from "@/components/version-log/VersionLogTable";
import { useVersionLogs } from "@/contexts/hooks/data-fetching/useVersionLogs";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";
import CalendarCard from "../common/CalendarCard";


export const VersionLogPage = () => {
  const navigate = useNavigate();
  const { date } = useParams();
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const today = new Date().toLocaleDateString("en-CA");
  const [selectedDate, setSelectedDate] = useState(
    date || sessionStorage.getItem("logDate") || today
  );
  const debouncedSearchQuery = useDebounce(
    (value) => setSearchQuery(value),
    300
  );
  const { role } = useUserContext();

  useEffect(() => {
    if (date && date !== selectedDate) {
      setSelectedDate(date);
      sessionStorage.setItem("logDate", date);
    }
  }, [date, selectedDate]);

  useEffect(() => {
    sessionStorage.setItem("logDate", selectedDate);
    setSearchQuery("");
    setInputValue("");
  }, [selectedDate]);

  const { data: logs = [], isLoading } = useVersionLogs({
    date: selectedDate,
    q: searchQuery,
  });

  const handleChange = (e) => {
    setInputValue(e.target.value);
    debouncedSearchQuery(e.target.value);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    navigate(`/version-log/${newDate}`);
  };

  return (
    <Box
      px={{ base: 4, md: 10 }}
      py={{ base: 4, md: 6 }}
      maxW="1440px"
      mx="auto"
    >
      {/* <HStack
        spacing={3}
        align="center"
        mb={6}
      >
        <Heading
          as="h1"
          size="lg"
          fontWeight="500"
          color="#111111"
        >
          Audit Log
        </Heading>
        {role && (
          <Badge
            bg="#5B4761"
            color="white"
            borderRadius="8px"
            px={3}
            py={1}
            fontSize="18px"
            fontWeight="500"
            textTransform="capitalize"
          >
            {role}
          </Badge>
        )}
      </HStack> */}

      <HStack
        spacing={{ base: 3, md: 6 }}
        align="stretch"
        mb={3}
      >
        <InputGroup flex="1">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search Providers"
            borderRadius="md"
            h="45px"
            value={inputValue}
            onChange={handleChange}
          />
        </InputGroup>

        <CalendarCard
          value={selectedDate}
          onChange={handleDateChange}
        />
      </HStack>
      <VersionLogTable
        loading={isLoading}
        logs={logs}
        selectedDate={selectedDate}
      />
    </Box>
  );
};
