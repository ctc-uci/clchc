import { useEffect, useState } from "react";

import { InfoOutlineIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

import Navbar from "../layout/Navbar";
import VersionLogTable from "./VersionLogTable";

export const VersionLogPage = () => {
  const [logs, setLogs] = useState([]);
  const { backend } = useBackendContext();
  // make a new state to track what's in the search bar
  // reference QuotaTrackingPage

  const fetchVersionLogs = async () => {
    try {
      const params = new URLSearchParams();

      if (query) {
        params.set("q", provider);
      }

      const endpoint = `/versionLog/details${params.toString() ? `?${params}` : ""}`;
      const response = await backend.get(endpoint);

      setLogs(response.data);
    } catch (err) {
      console.log("Failed to fetch version logs", err);
    }
  };

  useEffect(() => {
    fetchVersionLogs();
  }, [backend]);

  const debouncedFetch = useMemo(() => {
    return debounce((provider, date) => {
      fetchQuotas(provider, date);
    }, 300);
  }, [fetchQuotas]);

  // Handle cleanup
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  // handleChange

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
            //   onChange={handleChange}
          />
        </InputGroup>
        <VersionLogTable logs={logs} />
      </Stack>

      <Navbar />
    </Box>
  );
};
