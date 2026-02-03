import React, { useEffect, useState } from "react";

import {
  Button,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

export default function QuotaCalcFactor() {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();

  const [userInfo, setUserInfo] = useState(null);
  const [factor, setFactor] = useState(0);

  useEffect(() => {
    if (!currentUser?.uid) return;

    (async () => {
      try {
        const { data } = await backend.get(`/users/${currentUser.uid}`);
        setUserInfo(data?.[0] ?? null);
      } catch (e) {
        console.error("Failed to fetch user info:", e);
      }
    })();
  }, [backend, currentUser?.uid]);

  useEffect(() => {
    if (!userInfo) return;
    setFactor(userInfo.apptCalcFactor ?? 0);
  }, [userInfo]);

  const updateQuota = async (newQuota) => {
    await backend.put("users/update/set-calc-factor", {
      factor: newQuota,
      firebaseUid: userInfo.firebaseUid,
    });
  };

  const handleClick = async () => {
    await updateQuota(factor);
  };

  return (
    <VStack
      align="stretch"
      spacing="2em"
      backgroundColor="#ddd"
      borderRadius="1em"
      padding="1.5em"
      margin="1.5em"
    >
      <Text
        fontSize={20}
        fontWeight={"bold"}
      >
        Quota Calculation Factor
      </Text>
      <Text>
        This value is used to automatically calculate appointment quotas when
        creating new schedules. Individual quotas can still be overridden.
      </Text>
      <NumberInput
        value={isNaN(factor) ? 0 : factor}
        onChange={(_, val) => setFactor(val)}
        bg="gray.100"
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <Button onClick={handleClick}>Save Changes</Button>
    </VStack>
  );
}
