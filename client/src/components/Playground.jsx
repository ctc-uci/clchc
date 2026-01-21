import { Box, Text, Button, VStack, useDisclosure } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import QuotaDrawer from "./QuotaDrawer";
import QuotaTable from "./quotaTable";

export const Playground = () => {
  const { isOpen: isCreateDrawerOpen, onOpen: onCreateDrawerOpen, onClose: onCreateDrawerClose } = useDisclosure();

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text>Place your items here for testing</Text>
        
        <Button
          leftIcon={<FaPlus />}
          onClick={onCreateDrawerOpen}
          colorScheme="blue"
        >
          Create Quota
        </Button>

        <QuotaTable />

        <QuotaDrawer
          quotaID={0}
          isOpen={isCreateDrawerOpen}
          onOpen={onCreateDrawerOpen}
          onClose={onCreateDrawerClose}
        />
      </VStack>
    </Box>
  );
};

