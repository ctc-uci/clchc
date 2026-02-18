import { useCallback, useEffect, useMemo, useState } from "react";

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
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useDebounce } from "@/hooks/useDebounce";

export const VersionLogPage = () => {
  // const [logs, setLogs] = useState([]);
  // const { backend } = useBackendContext();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(
    (value) => setSearchQuery(value),
    300
  );
  // const [loading, setLoading] = useState(true);

  const {
    data: logs = [],
    isLoading,
    error,
    refetch,
  } = useVersionLogs({
    q: searchQuery,
  });


  // handleChange
  const handleChange = (e) => {
    debouncedSearchQuery(e.target.value);
  };

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
        />
      </Stack>

      <Navbar />
    </Box>
  );
};
