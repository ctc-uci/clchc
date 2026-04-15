import { useState, useEffect } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
} from "@chakra-ui/react";

import { PageHeader } from "@/components/common/PageHeader";
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
  const { role, loading: roleLoading } = useUserContext();

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
    <Box p={6}>
      <Flex align="center" justify="space-between" mb={6} h="45px">
        <PageHeader
          title="Audit Log"
          role={role}
          isLoading={roleLoading}
        />
      </Flex>

      <HStack
        spacing={{ base: 3, md: 6 }}
        align="stretch"
        mb={5}
      >
        <InputGroup flex="1">
          <InputLeftElement 
            display="flex"
            alignItems="center"
            h="100%"
            pointerEvents="none"
          >
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            backgroundColor="white"
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
