import { useCallback, useEffect, useMemo, useState } from "react";

import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import debounce from "lodash.debounce";
import InputMask from "react-input-mask";

import { CustomCard } from "./customCard";
import QuotaTable from "./QuotaTable";

export const QuotaTracking = () => {
  const { backend } = useBackendContext();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerQuery, setProviderQuery] = useState("");

  const fetchQuotas = useCallback(
    async (provider) => {
      let endpoint = `/quota/details`;

      if (provider) {
        endpoint += `?provider=${provider}`;
      }
      try {
        const response = await backend.get(endpoint);
        setRows(response.data);
      } catch (err) {
        console.error("Failed to fetch quotas", err);
      } finally {
        setLoading(false);
      }
    },
    [backend]
  );

  const debouncedFetch = useMemo(() => {
    return debounce((provider) => {
      fetchQuotas(provider);
    }, 300); // TODO: If we have multiple debounced inputs, we should set a universal delay in a constants file.
  }, [fetchQuotas]);

  // Handle cleanup
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    if (!providerQuery) {
      // If the search input is empty, immediately fetch all quotas
      debouncedFetch.cancel();
      fetchQuotas();
      return;
    }
    debouncedFetch(providerQuery);
  }, [fetchQuotas, providerQuery, debouncedFetch]);

  const handleChange = (e) => {
    setProviderQuery(e.target.value);
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
            <Heading size="lg">Quota Tracking</Heading>
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
            Monitor daily appointment progress across all providers
          </Text>
        </Box>

        <Box
          flex="1"
          display="flex"
          justifyContent="flex-end"
        >
          <InputGroup w="19ch">
            <Input
              textAlign="center"
              type="date"
              as={InputMask}
              mask="99/99/9999"
              placeholder="MM/DD/YYYY"
              onChange={(e) => console.log("date input:", e.target.value)}
            />
          </InputGroup>
        </Box>

        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          ml={4}
        >
          Create Quota
        </Button>
      </Flex>

      <Box
        overflowX="auto"
        py={4}
        mb={6}
      >
        <HStack
          spacing={4}
          minW="min-content"
        >
          <CustomCard
            title="Total Progress"
            body="5/12"
            height="12rem"
            width="14rem"
          />
          <CustomCard
            title="Completion Rate"
            body="73%"
            footer="Overall Progress"
            height="12rem"
            width="14rem"
          />
          <CustomCard
            title="Active Providers"
            body="9"
            footer="3 Locations"
            height="12rem"
            width="14rem"
          />
          <CustomCard
            title="Needs Attention"
            body="0"
            footer="Below 40% Progress"
            height="12rem"
            width="14rem"
          />
        </HStack>
      </Box>

      <InputGroup
        maxW="400px"
        pb={6}
      >
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search Providers"
          borderRadius="md"
          onChange={handleChange}
        />
      </InputGroup>

      <QuotaTable
        rows={rows}
        loading={loading}
      />
    </Box>
  );
};
