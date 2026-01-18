import React from "react";
import { Box, Button, Divider, Grid, Flex, Text } from "@chakra-ui/react";
import { Navbar } from "@/components/Navbar";

export const ProviderDirectoryPage = () => {
  return (
    <Box p={8}>
      {/* Overview Card */}
      <Box
        width="2083px"
        height="261px"
        bg="#E2E2E2"
        borderRadius="13px"
        p={6}
        mb={10}
      >
        {/* Header */}
        <Box mb={4}>
          <Text fontSize="xl" fontWeight="semibold">
            Overview
          </Text>
          <Text fontSize="lg" color="gray.600">
            Summary of provider
          </Text>
        </Box>

        <HorizontalDivider/>

        {/* Stats */}
        <Grid
          templateColumns="repeat(4, 1fr)"
          position="relative"
        >
          <StatItem label="New Providers" value="5" />
          <StatItem label="Total Providers" value="500" />
          <StatItem label="Providers per Location" value="4" />
          <StatItem label="Specialties Covered" value="4" />

          {/* Vertical dividers */}
          <GridDivider left="25%" />
          <GridDivider left="50%" />
          <GridDivider left="75%" />
        </Grid>
      </Box>
      <Navbar />
    </Box>
  );
};

/* Reusable Stat Item */
const StatItem = ({ label, value }) => (
  <Box textAlign="left">
    <Text fontSize="lg" color="gray.700" mb={1}>
      {label}
    </Text>
    <Text fontSize="3xl" fontWeight="bold">
      {value}
    </Text>
  </Box>
);

/* Horizontal Divider */
const HorizontalDivider = () => (
  <Divider 
    borderColor="black.400" 
    length="1,906px"
  />
);

/* Grid Divider */
const GridDivider = ({ left }) => (
  <Box
    position="absolute"
    top={0}
    bottom={0}
    left={`calc(${left} - 20px)`}
    width="1px"
    bg="gray.400"
  />
);