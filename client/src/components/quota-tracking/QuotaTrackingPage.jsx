import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  useDisclosure,
} from "@chakra-ui/react";
import { CustomCard } from "@/components/common/CustomCard";
import Navbar from "@/components/layout/Navbar";
import QuotaDrawer from "@/components/quota-tracking/QuotaDrawer";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuotas } from "@/contexts/hooks/data-fetching/useQuotas";
import CalendarCard from "../common/CalendarCard";
import QuotaTable from "./QuotaTable";

export const QuotaTracking = () => {
  const navigate = useNavigate();
  const { dateParam } = useParams();
  const [rows, setRows] = useState([]);
  const [providerQuery, setProviderQuery] = useState("");
  // const [debouncedProviderQuery, setDebouncedProviderQuery] = useState("");
  const debouncedProviderQuery = useDebounce(
  (value) => setProviderQuery(value),
  300
);
  const { role } = useUserContext();

  // get current date and reformat
  const today = new Date().toLocaleDateString("en-CA");
  const [selectedDate, setSelectedDate] = useState(
    dateParam || sessionStorage.getItem("quotaDate") || today
  );

  useEffect(() => {
    if (dateParam && dateParam !== selectedDate) {
      setSelectedDate(dateParam);
      sessionStorage.setItem("quotaDate", dateParam);
    }
  }, [dateParam]);

  useEffect(() => {
    sessionStorage.setItem("quotaDate", selectedDate);
  }, [selectedDate]);

  const {
    data: quotas = [],
    isLoading,
  } = useQuotas({
    date: selectedDate,
    provider: providerQuery,
  });

  const stats = useMemo(() => {
    // undefined quotas
    if (!quotas || quotas.length === 0) {
      return { totalProgress: 0, totalQuota: 0, rate: 0, activeProviders: 0, needsAttention: 0 };
    }

    let totalProgress = 0;
    let totalQuota = 0;
    let needsAttentionCount = 0;
    const distinctProviders = new Set();
    const distinctLocations = new Set();

    quotas.forEach((q) => {
      // totals
      const p = Number(q.progress) || 0;
      const t = Number(q.quota) || 0;
      totalProgress += p;
      totalQuota += t;

      if (q.providerId) distinctProviders.add(q.providerId);
      if (q.locationId) distinctLocations.add(q.locationId);

      // needs attention if under 40%
      if (t > 0 && (p / t) < 0.4) {
        needsAttentionCount++;
      }
    });

    return {
      totalProgress,
      totalQuota,
      rate: totalQuota > 0 ? Math.round((totalProgress / totalQuota) * 100) : 0,
      activeProviders: distinctProviders.size,
      differentLocations: distinctLocations.size,
      needsAttention: needsAttentionCount,
    };
  }, [quotas]);

  const {
    isOpen: isCreateDrawerOpen,
    onOpen: onCreateDrawerOpen,
    onClose: onCreateDrawerClose,
  } = useDisclosure();

  const handleChange = (e) => {
    debouncedProviderQuery(e.target.value);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    navigate(`/quota-tracking/${newDate}`);
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
              {role ?? "Viewer"}
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
          <CalendarCard
            value={selectedDate}
            onChange={handleDateChange}
          />
        </Box>

        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          ml={4}
          onClick={onCreateDrawerOpen}
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
            body={`${stats.totalProgress}/${stats.totalQuota}`} 
            height="12rem"
            width="14rem"
          />
          <CustomCard
            title="Completion Rate"
            body={`${stats.rate}%`}
            footer="Overall Progress"
            height="12rem"
            width="14rem"
          />
          <CustomCard
            title="Active Providers"
            body={stats.activeProviders.toString()}
            footer={`${stats.differentLocations} different locations`}
            height="12rem"
            width="14rem"
          />
          <CustomCard
            title="Needs Attention"
            body={stats.needsAttention.toString()}
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
        rows={quotas}
        loading={isLoading}
      />

      <QuotaDrawer
        quotaID={0}
        isOpen={isCreateDrawerOpen}
        onOpen={onCreateDrawerOpen}
        onClose={onCreateDrawerClose}
        defaultDate={selectedDate}
      />

      <Navbar />
    </Box>
  );
};
