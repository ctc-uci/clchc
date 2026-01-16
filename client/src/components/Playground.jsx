import React, {useEffect, useState} from "react";
import { Box, Text } from "@chakra-ui/react";
import {useBackendContext} from "../contexts/hooks/useBackendContext";
import ProviderTable from "./ProviderTable";

export const Playground = () => {
  const {backend} = useBackendContext();
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    (async() => {
      const {data:cats} = await backend.get("/directoryCategories");
      const {data:prov} = await backend.get("/providers");
      setCategories(cats);
      setProviders(prov);
      
    }) (); 
  }, []);
  
  return (
    <Box>
      <Text>Place your items here for testing</Text>
      <ProviderTable
        providers={providers}
        providerCategories={categories}
      />
    </Box>
  );
};

