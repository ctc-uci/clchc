import { useEffect, useMemo, useState } from "react";

import { AddIcon, HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { Navbar } from "@/components/layout/Navbar";
import CategoryDrawer from "@/components/provider-directory/CategoryDrawer";
import ProviderTable from "@/components/provider-directory/ProviderTable";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { useProviders } from "@/contexts/hooks/data-fetching/useProviders";
import { useDirectoryCategories } from "@/contexts/hooks/data-fetching/useDirectoryCategories";
import { useDebounce } from "@/hooks/useDebounce";

export const ProviderDirectoryPage = () => {
  // const [providers, setProviders] = useState(null);
  // const [providerCategories, setProviderCategories] = useState(null);
  const [providerQuery, setProviderQuery] = useState("");
  const debouncedProviderQuery = useDebounce(
  (value) => setProviderQuery(value),
  300
);
  const { role, loading } = useUserContext();
  const {
      isOpen: isCreateDrawerOpen,
      onOpen: onCreateDrawerOpen,
      onClose: onCreateDrawerClose,
    } = useDisclosure();
  const {
    data: providers = [],
    isLoading,
    error,
    refetch: refetchProviders
  } = useProviders({
    query: providerQuery
  });
  const {
    data: providerCategories = [],
    isLoading: loadingCategories,
    error: errorCategories,
    refetch: refetchCategories
  } = useDirectoryCategories();

  const { backend } = useBackendContext();

  // const fetchData = async (provider = "") => {
  //   let endpoint = "/providers";

  //   if (provider) {
  //     endpoint += `?search=${provider}`;
  //   }

  //   const [providerData, catData] = await Promise.all([
  //     backend.get(endpoint),
  //     backend.get("/directoryCategories"),
  //   ]);

  //   setProviders(providerData.data);
  //   setProviderCategories(catData.data);
  // };

  const handleChange = (e) => {
    debouncedProviderQuery(e.target.value);
  };

  return (
    <Box
      p={6}
      maxW="1200px"
      mx="auto"
    >
      <Flex
        alignItems="center"
        gap={3}
        mb={5}
      >
        <Heading
          size="2xl"
          fontWeight="medium"
        >
          Provider Directory
        </Heading>
        <Tag
          bg="yellow.300"
          color="black"
          fontSize="lg"
        >
          {role}
        </Tag>
      </Flex>
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
          justifyContent="space-between"
          alignItems="center"
          mb={5}
          gap={4}
        >
          <InputGroup maxW="600px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search Providers"
              borderRadius="md"
              onChange={handleChange}
            />
          </InputGroup>

          <Flex gap={3}>
            <Button
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              rightIcon={<HamburgerIcon />}
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
              rightIcon={<AddIcon />}
            >
              Add New
            </Button>
          </Flex>
        </Flex>
      ) : (
        <></>
      )}

      {providers && providerCategories ? (
        <Box>
          <ProviderTable
            providers={providers}
            providerCategories={providerCategories}
            loading={isLoading || loadingCategories}
          />
        </Box>
      ) : (
        <Text>Loading</Text>
      )}
      <CategoryDrawer
        isOpen={isCreateDrawerOpen}
        onOpen={onCreateDrawerOpen}
        onClose={onCreateDrawerClose}
        onSaved={refetchCategories}
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
