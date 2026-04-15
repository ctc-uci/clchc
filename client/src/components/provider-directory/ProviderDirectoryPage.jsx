import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { PageHeader } from "@/components/common/PageHeader";
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
  const [manageOpen, setManageOpen] = useState(false);

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
    <Box p={6}>
      {role === "ccm" || role === "master" ? (
        <Flex
          flexDirection="column"
          mb={5}
          gap={6}
        >
          {/* TOP ROW: PageHeader + Manage Button */}
          <Flex justify="space-between" align="center">
            <PageHeader
              title="Provider Directory"
              role={role}
              isLoading={roleLoading}
            />
            <Box position="relative">
              <Button
                bg="var(--Primary-1, #022442)"
                color="white"
                h={"45px"}
                w={"135px"}
                padding={"8px 12px"}
                fontFamily={"Inter"}
                fontSize={"18px"}
                fontStyle={"normal"}
                fontWeight={"600"}
                lineHeight={"28px"}
                _hover={{ bg: "#022442" }}
                _active={{ bg: "#022442" }}
                leftIcon={<HamburgerIcon size={"24px"}/>}
                borderRadius={manageOpen ? "4px 4px 0 0" : "4px"}
                onClick={() => setManageOpen(o => !o)}
              >
                Manage
              </Button>
              <AnimatePresence>
                {manageOpen && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0.85, y: -4 }}
                    animate={{ opacity: 1, scaleY: 1, y: 0 }}
                    exit={{ opacity: 0, scaleY: 0.85, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      width: "100%",
                      zIndex: 10,
                      transformOrigin: "top",
                      borderRadius: "0 0 4px 4px",
                      overflow: "hidden",
                      backgroundColor: "#022442",
                    }}
                  >
                    <Box
                      w="100%"
                      px={4}
                      py={3}
                      color="white"
                      fontFamily="Inter"
                      fontSize="18px"
                      fontStyle="normal"
                      fontWeight="600"
                      lineHeight="28px"
                      borderBottom="1px solid"
                      borderColor="whiteAlpha.200"
                      cursor="pointer"
                      _hover={{ bg: "whiteAlpha.100" }}
                      onClick={() => { onCategoryDrawerOpen(); setManageOpen(false); }}
                    >
                      Categories
                    </Box>
                    <Box
                      w="100%"
                      px={4}
                      py={3}
                      color="white"
                      fontFamily="Inter"
                      fontSize="18px"
                      fontStyle="normal"
                      fontWeight="600"
                      lineHeight="28px"
                      cursor="pointer"
                      _hover={{ bg: "whiteAlpha.100" }}
                      onClick={() => { openCreateProviderDrawer(); setManageOpen(false); }}
                    >
                      Providers
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Flex>
          {/* BOTTOM ROW: Search Bar */}
          <InputGroup width="100%">
            <InputLeftElement 
              display="flex"
              alignItems="center"
              h="100%"
              pointerEvents="none"
            >
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              bg="white"
              placeholder="Search Providers"
              borderRadius="md"
              h="45px"
              onChange={handleChange}
            />
          </InputGroup>
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
            onCreateProvider={
              role === "ccm" || role === "master"
                ? openCreateProviderDrawer
                : undefined
            }
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
