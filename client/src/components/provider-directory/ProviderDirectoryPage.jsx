import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { Navbar } from "@/components/layout/Navbar";
import CategoryDrawer from "@/components/provider-directory/CategoryDrawer";
import ProviderTable from "@/components/provider-directory/ProviderTable";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";

export const ProviderDirectoryPage = () => {
  const [providers, setProviders] = useState(null);
  const [providerCategories, setProviderCategories] = useState(null);
  const { role, loading } = useRoleContext();
  const {
    isOpen: isCreateDrawerOpen,
    onOpen: onCreateDrawerOpen,
    onClose: onCreateDrawerClose,
  } = useDisclosure();

  const { backend } = useBackendContext();

  const fetchData = async () => {
    const [providerData, catData] = await Promise.all([
      backend.get("/providers"),
      backend.get("/directoryCategories"),
    ]);
    setProviders(providerData.data);
    setProviderCategories(catData.data);
  };

  useEffect(() => {
    fetchData();
  }, [backend]);

  return (
    <Box
      p={6}
      maxW="1200px"
      mx="auto"
    >
      <Heading
        size="2xl"
        fontWeight="medium"
        mb={5}
      >
        Provider Directory
      </Heading>
      <Text
        size="lg"
        fontWeight="normal"
        color="#00000080"
        mb={5}
      >
        {" "}
        All current active providers in network
      </Text>

      {role === "ccm" || role === "master" ? (
        <Flex
          justifyContent="flex-end"
          mb={5}
        >
          <Button
            onClick={() => {
              onCreateDrawerOpen();
            }}
            bg="black"
            color="white"
            _hover={{ bg: "gray.800" }}
            marginRight="1.5em"
          >
            Manage
          </Button>
          <Button
            onClick={() => {
              onCreateDrawerOpen();
            }}
            bg="black"
            color="white"
            _hover={{ bg: "gray.800" }}
          >
            Add New
          </Button>
        </Flex>
      ) : (
        <></>
      )}

      {providers && providerCategories ? (
        <Box>
          <ProviderTable
            providers={providers}
            providerCategories={providerCategories}
          />
        </Box>
      ) : (
        <Text>Loading</Text>
      )}
      <CategoryDrawer
        isOpen={isCreateDrawerOpen}
        onOpen={onCreateDrawerOpen}
        onClose={onCreateDrawerClose}
        onSaved={fetchData}
      />
      <Navbar />
    </Box>
  );
};

/* Reusable Stat Item */
const StatItem = ({ label, value }) => (
  <Box textAlign="left">
    <Text
      fontSize="lg"
      color="gray.700"
      mb={1}
    >
      {label}
    </Text>
    <Text
      fontSize="3xl"
      fontWeight="bold"
    >
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
