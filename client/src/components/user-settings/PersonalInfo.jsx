import React, { useEffect, useState } from "react";

import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

export default function PersonalInfo() {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) return;

    (async () => {
      try {
        const { data } = await backend.get(`/users/firebase/${currentUser.uid}`);
        setUserInfo(data?.[0] ?? null);
      } catch (e) {
        console.error("Failed to fetch user info:", e);
      }
    })();
  }, [backend, currentUser?.uid]);

  if (!userInfo) return null;

  const updateUserProp = (key, value) => {
    setUserInfo((prev) => ({ ...prev, [key]: value }));
  };

  const updateUser = async () => {
    try {
      await backend.put(`/users/firebase/${currentUser.uid}`, {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
      });
      alert("Changes saved successfully.");
    } catch (e) {
      console.error("Failed to update user:", e);
    }
  };

  return (
    <VStack
      align="stretch"
      spacing="2em"
      backgroundColor="#ddd"
      borderRadius="1em"
      padding="1.5em"
      margin="1.5em"
      h="auto"
    >
      <FormControl>
        <Text
          fontSize={20}
          fontWeight="bold"
        >
          Personal Information
        </Text>
        <Grid>
          <FormLabel>First Name</FormLabel>
          <Input
            value={userInfo.firstName ?? ""}
            onChange={(e) => updateUserProp("firstName", e.target.value)}
            bg="gray.100"
          />
        </Grid>
      </FormControl>

      <FormControl>
        <Grid>
          <FormLabel>Last Name</FormLabel>
          <Input
            value={userInfo.lastName ?? ""}
            onChange={(e) => updateUserProp("lastName", e.target.value)}
            bg="gray.100"
          />
        </Grid>
      </FormControl>

      <FormControl>
        <Grid>
          <FormLabel>Email Address</FormLabel>
          <Input
            value={userInfo.email ?? ""}
            onChange={(e) => updateUserProp("email", e.target.value)}
            bg="gray.100"
          />
        </Grid>
      </FormControl>

      <FormControl>
        <Grid>
          <FormLabel>Role</FormLabel>
          <Input
            value={userInfo.role ?? ""}
            readOnly
            bg="gray.100"
          />
        </Grid>
      </FormControl>

      <Button onClick={updateUser}>Apply changes</Button>
    </VStack>
  );
}
