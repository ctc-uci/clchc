import { useState } from "react";

import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { PageHeader } from "@/components/common/PageHeader";
import { Navbar } from "@/components/layout/Navbar";
import CategoryDrawer from "@/components/provider-directory/CategoryDrawer";
import ProviderDrawer from "@/components/provider-directory/ProviderDrawer";
import ProviderTable from "@/components/provider-directory/ProviderTable";
import { useDirectoryCategories } from "@/contexts/hooks/data-fetching/useDirectoryCategories";
import { useProviders } from "@/contexts/hooks/data-fetching/useProviders";
import { useTags } from "@/contexts/hooks/data-fetching/useTags";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { useDebounce } from "@/hooks/useDebounce";

export const ProviderDirectoryPage = () => {
  const [providerQuery, setProviderQuery] = useState("");
  const [drawerMode, setDrawerMode] = useState("create");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [highlightedProviderId, setHighlightedProviderId] = useState(null);

  const debouncedProviderQuery = useDebounce(
    (value) => setProviderQuery(value),
    300
  );
  const { role, loading: roleLoading } = useUserContext();

  const { refetch: refetchTags } = useTags();

  const {
    isOpen: isCategoryDrawerOpen,
    onOpen: onCategoryDrawerOpen,
    onClose: onCategoryDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isProviderDrawerOpen,
    onOpen: onProviderDrawerOpen,
    onClose: onProviderDrawerClose,
  } = useDisclosure();

  const {
    data: providers = [],
    isLoading,
    refetch: refetchProviders,
  } = useProviders({
    query: providerQuery,
  });

  const {
    data: providerCategories = [],
    isLoading: loadingCategories,
    refetch: refetchCategories,
  } = useDirectoryCategories();

  const handleChange = (e) => {
    debouncedProviderQuery(e.target.value);
  };

  const openCreateProviderDrawer = () => {
    setDrawerMode("create");
    setSelectedProvider(null);
    onProviderDrawerOpen();
  };

  const openEditProviderDrawer = (provider) => {
    setDrawerMode("edit");
    setSelectedProvider(provider);
    onProviderDrawerOpen();
  };

  const handleDrawerSaved = () => {
    refetchProviders();
    refetchTags();
  };

  return (
    <Box
      p={6}
      maxW="1200px"
      mx="auto"
    >
      <Box mb={5}>
        <PageHeader
          title="Provider Directory"
          subheading="All current active providers in network"
          role={role}
          isLoading={roleLoading}
        />
      </Box>

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
            <Menu>
              <MenuButton
                as={Button}
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                _active={{ bg: "gray.800" }}
                rightIcon={<HamburgerIcon />}
              >
                Manage
              </MenuButton>
              <MenuList>
                <MenuItem isDisabled>Tags</MenuItem>
                <MenuItem onClick={onCategoryDrawerOpen}>Categories</MenuItem>
                <MenuItem onClick={openCreateProviderDrawer}>
                  Providers
                </MenuItem>
              </MenuList>
            </Menu>
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
            selectedProviderId={highlightedProviderId}
            onProviderSelect={
              role === "ccm" || role === "master"
                ? (provider) => setHighlightedProviderId(provider.id)
                : undefined
            }
            onProviderDoubleClick={
              role === "ccm" || role === "master"
                ? openEditProviderDrawer
                : undefined
            }
            loading={isLoading || loadingCategories}
          />
        </Box>
      ) : (
        <Text>Loading</Text>
      )}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onOpen={onCategoryDrawerOpen}
        onClose={onCategoryDrawerClose}
        onSaved={refetchCategories}
      />
      <ProviderDrawer
        mode={drawerMode}
        provider={selectedProvider}
        categories={providerCategories}
        isOpen={isProviderDrawerOpen}
        onClose={onProviderDrawerClose}
        onSaved={handleDrawerSaved}
      />
      <Navbar />
    </Box>
  );
};

/* Reusable Stat Item */
// const StatItem = ({ label, value }) => (
//   <Box textAlign="left">
//     <Text
//       fontSize="lg"
//       color="gray.700"
//       mb={1}
//     >
//       {label}
//     </Text>
//     <Text
//       fontSize="3xl"
//       fontWeight="bold"
//     >
//       {value}
//     </Text>
//   </Box>
// );

// /* Horizontal Divider */
// const HorizontalDivider = () => (
//   <Divider
//     borderColor="black.400"
//     length="1,906px"
//   />
// );

// /* Grid Divider */
// const GridDivider = ({ left }) => (
//   <Box
//     position="absolute"
//     top={0}
//     bottom={0}
//     left={`calc(${left} - 20px)`}
//     width="1px"
//     bg="gray.400"
//   />
// );
