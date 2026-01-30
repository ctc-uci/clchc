import React, { useState } from "react";

import {
  Box,
  Button,
  Flex,
  HStack,
  FormControl,
  FormErrorMessage,
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

  const isDisabled = input !== "DELETE";

  const Instructions = () => (
    <>

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
    </>
  )

  // Written as function, not component to prevent it from
  // rerendering to avoid losing focus on input
  const renderDeleteControls = () => (
    <HStack>
      <Input
        value={input}
        width="15em"
        backgroundColor="white"
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        isDisabled={isDisabled}
        _hover={isDisabled ? "none" : undefined}
        backgroundColor="#bbb"
        onClick={handleDelete}>Delete Account
      </Button>
    </HStack>
  )

  return (
    <Flex
      backgroundColor="#ddd"
      borderRadius="1em"
      padding="1.5em"
      height="42vh"
    >
      <FormControl>
        <Grid gap="2em">
          <Text fontSize={20}>Deleting Account</Text>
          <Grid gap="2em" marginLeft="1.5em">
            <Instructions />
            {renderDeleteControls()}
          </Grid>
        </Grid>
      </FormControl>
    </Flex>
  );
}
