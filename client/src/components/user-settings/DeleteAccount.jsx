import React, { useState } from "react";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Text,
} from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

export default function DeleteAccount() {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [input, setInput] = useState("");

  const handleDelete = async () => {
    try {
      if (input === "DELETE") {
        await backend.delete(`/users/${currentUser.uid}`);
      }
    } catch (e) {
      alert("Incorrect.");
    }
  };

  return (
    <Grid>
      <FormControl>
        <Grid>
          <FormLabel fontSize={20}>Deleting Account</FormLabel>
          <Text>
            Are you sure? Deleting your account is permament and will remove all
            your information from the database. This action{" "}
            <Text
              as={"span"}
              fontWeight={"bold"}
            >
              cannot
            </Text>{" "}
            be undone.
          </Text>
          <Text>To confirm this, type "DELETE"</Text>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Grid>
        <Button onClick={handleDelete}>Delete Account</Button>
      </FormControl>
    </Grid>
  );
}
