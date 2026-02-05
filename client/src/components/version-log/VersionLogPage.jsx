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

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import debounce from "lodash.debounce";

import Navbar from "../layout/Navbar";
import VersionLogTable from "./VersionLogTable";

export const VersionLogPage = () => {
  const [logs, setLogs] = useState([]);
  const { backend } = useBackendContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  // reference QuotaTrackingPage

  const fetchVersionLogs = useCallback(
    async (searchQuery) => {
      setLoading(true); // Only display loading text on initial load
      const params = new URLSearchParams();

      if (searchQuery) {
        params.set("q", searchQuery);
      }

      const endpoint = `/versionLog/details${params.toString() ? `?${params}` : ""}`;
      try {
        const response = await backend.get(endpoint);
        setLogs(response.data);
      } catch (err) {
        console.log("Failed to fetch version logs", err);
      } finally {
        setLoading(false);
      }
    },
    [backend]
  );

  useEffect(() => {
    fetchVersionLogs();
  }, [fetchVersionLogs]);

  const debouncedFetch = useMemo(() => {
    return debounce((q) => {
      fetchVersionLogs(q);
    }, 300);
  }, [fetchVersionLogs]);

  // Handle cleanup
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    debouncedFetch.cancel();

    if (!searchQuery) {
      fetchVersionLogs("");
      return;
    }

    debouncedFetch(searchQuery);
  }, [searchQuery, fetchVersionLogs, debouncedFetch]);

  // handleChange
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
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
          loading={loading}
          logs={logs}
        />
      </Stack>

      <Navbar />
    </Box>
  );
};
