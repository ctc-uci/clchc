import { useEffect, useMemo, useState } from "react";

import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";

import { CustomCard } from "@/components/common/CustomCard";
import { PageHeader } from "@/components/common/PageHeader";
import Navbar from "@/components/layout/Navbar";
import QuotaDrawer from "@/components/quota-tracking/QuotaDrawer";
import { useQuotas } from "@/contexts/hooks/data-fetching/useQuotas";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";

import CalendarCard from "../common/CalendarCard";
import QuotaTable from "./QuotaTable";

const SkeletonCard = () => {
  return (
    <Card
      height="12rem"
      width="14rem"
      flexShrink={1}
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="box-shadow 0.2s ease"
    >
      <CardHeader pb={1}>
        <Box
          fontSize="sm"
          color="gray.500"
          fontWeight="medium"
        >
          <Skeleton height="10px" />
        </Box>
      </CardHeader>

      <CardBody py={2}>
        <Box
          fontSize="3xl"
          fontWeight="semibold"
          color="gray.900"
        >
          <Skeleton height="20px" />
        </Box>
      </CardBody>
    </Card>
  );
};

export const QuotaTracking = () => {
  const navigate = useNavigate();
  const { dateParam } = useParams();
  const [providerQuery, setProviderQuery] = useState("");
  // const [debouncedProviderQuery, setDebouncedProviderQuery] = useState("");
  const debouncedProviderQuery = useDebounce(
    (value) => setProviderQuery(value),
    300
  );
  const { role, loading: roleLoading } = useUserContext();

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

  const { data: quotas = [], isLoading } = useQuotas({
    date: selectedDate,
    provider: providerQuery,
  });

  const stats = useMemo(() => {
    // undefined quotas
    if (!quotas || quotas.length === 0) {
      return {
        totalProgress: 0,
        totalQuota: 0,
        rate: 0,
        activeProviders: 0,
        needsAttention: 0,
      };
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
      if (t > 0 && p / t < 0.4) {
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
      maxW="1440px"
      mx="auto"
    >
      <Flex
        mb={6}
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <PageHeader
          title="Quota Tracking"
          subheading="Monitor daily appointment progress across all providers"
          role={role}
          isLoading={roleLoading}
        />
        <Flex
          gap="6px"
          alignItems="center"
          mt={1}
        >
          <CalendarCard
            value={selectedDate}
            onChange={handleDateChange}
          />
          {role !== "viewer" && (
            <Button
              rightIcon={<AddIcon boxSize={3} />}
              px="24px"
              height="44px"
              width="156.112px"
              background="#113D64"
              borderRadius="4px"
              gap="2px"
              onClick={onCreateDrawerOpen}
              color="white"
              fontSize="14px"
              fontWeight="normal"
              lineHeight="28px"
              _hover={{ background: "#485365" }}
            >
              Create Quota
            </Button>
          )}
        </Flex>
      </Flex>

      <Flex
        gap="15px"
        h="195px"
        alignItems="center"
        mb={6}
      >
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <CustomCard
                title="Total Progress"
                body={`${stats.totalProgress}/${stats.totalQuota}`}
                height="172.83px"
                width="337px"
              />
              <CustomCard
                title="Completion Rate"
                body={`${stats.rate}%`}
                footer="Overall progress"
                height="172.83px"
                width="337px"
              />
              <CustomCard
                title="Active Providers"
                body={stats.activeProviders.toString()}
                footer={`${stats.differentLocations} locations`}
                height="172.83px"
                width="337px"
              />
              <CustomCard
                title="Needs Attention"
                body={stats.needsAttention.toString()}
                footer=""
                height="172.83px"
                width="337px"
              />
            </>
          )}
      </Flex>


      <Box pb={6}>
        <InputGroup maxW="auto">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="rgba(0,0,0,0.5)" />
          </InputLeftElement>
          <Input
            placeholder="Search Providers"
            borderRadius="md"
            onChange={handleChange}
            _placeholder={{ color: "rgba(0,0,0,0.5)" }}
          />
        </InputGroup>
      </Box>

      <QuotaTable
        rows={quotas}
        loading={isLoading}
        role={role}
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
