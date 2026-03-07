import { useState } from "react";

import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";

import { PageHeader } from "@/components/common/PageHeader";
import Navbar from "@/components/layout/Navbar";
import VersionLogTable from "@/components/version-log/VersionLogTable";
import { useVersionLogs } from "@/contexts/hooks/data-fetching/useVersionLogs";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { useDebounce } from "@/hooks/useDebounce";

export const VersionLogPage = () => {
  // const [logs, setLogs] = useState([]);
  // const { backend } = useBackendContext();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(
    (value) => setSearchQuery(value),
    300
  );
  const { role, loading: roleLoading } = useUserContext();
  // const [loading, setLoading] = useState(true);

  const { data: logs = [], isLoading } = useVersionLogs({
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
        <PageHeader
          title="Version Log"
          subheading="View action history over given day"
          role={role}
          isLoading={roleLoading}
        />
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
