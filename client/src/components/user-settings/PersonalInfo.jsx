import React, { useEffect, useState } from "react";

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import useUser from "./useUser";

export default function PersonalInfo() {
  const { userInfo, setUserInfo, errorMessage, updateUser } = useUser();

  if (!userInfo) {
    return null;
  }
  /**
   * useEffect(function, dependencyArray)
   * useEffect(() => {
   * }, [])    [] means no dependencies which means useEffect only runs the first time you render/mount
   * If you do have dependencies, it would run the effect every time the dependency changes
   */

  const updateUserProp = (key, value) => {
    setUserInfo((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * const funcName = async () => {
   *     const {content} = await promise();
   * }
   */

  return (
    <VStack
      align="stretch"
      spacing="2em"
      backgroundColor="#ddd"
      borderRadius="1em"
      padding="1.5em"
      margin="1.5em"
      height:auto
    >
      <FormControl>
        <Text
          fontSize={20}
          fontWeight={"bold"}
        >
          Personal Information
        </Text>
        <Grid>
          <FormLabel>First Name</FormLabel>
          <Input
            value={userInfo.firstName}
            onChange={(e) => updateUserProp("firstName", e.target.value)}
            bg="gray.100"
          />
        </Grid>
      </FormControl>
      <FormControl>
        <Grid>
          <FormLabel>Last Name</FormLabel>
          <Input
            value={userInfo.lastName}
            onChange={(e) => updateUserProp("lastName", e.target.value)}
            bg="gray.100"
          />
        </Grid>
      </FormControl>
      <FormControl>
        <Grid>
          <FormLabel>Email Address</FormLabel>
          <Input
            value={userInfo.email}
            onChange={(e) => updateUserProp("email", e.target.value)}
            bg="gray.100"
          />
        </Grid>
      </FormControl>
      <FormControl>
        <Grid>
          <FormLabel>Role</FormLabel>
          <Input
            value={userInfo.role}
            readOnly={true}
            bg="gray.100"
          />
        </Grid>
      </FormControl>
      <Button onClick={updateUser}>Apply changes</Button>
      <Text>{errorMessage}</Text>
    </VStack>
  );
}
