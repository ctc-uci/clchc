import React, {useEffect, useState} from "react";
import { Box, Text } from "@chakra-ui/react";
import {useBackendContext} from "../contexts/hooks/useBackendContext";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";

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
  console.log(categories, providers);
  
  return (
    <Box>
      <Text>Place your items here for testing</Text>
    </Box>
  );
};

