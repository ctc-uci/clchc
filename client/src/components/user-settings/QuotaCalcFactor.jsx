import React, { useEffect, useState } from "react";

import {
  Button,
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
import { useUserContext } from "@/contexts/hooks/useUserContext";

export default function QuotaCalcFactor() {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const { dbUser, refetch } = useUserContext();

  const [factor, setFactor] = useState(0);

  useEffect(() => {
    setFactor(dbUser?.apptCalcFactor ?? 0);
  }, [dbUser]);

  const updateQuota = async (newQuota) => {
    if (!currentUser?.uid) return;
    await backend.put(`/users/firebase/${currentUser.uid}`, {
      apptCalcFactor: newQuota,
    });
    await refetch();
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
        value={Number.isFinite(factor) ? factor : 0}
        onChange={(_, valueAsNumber) => {
          setFactor(Number.isFinite(valueAsNumber) ? valueAsNumber : 0);
        }}
        bg="gray.100"
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <Button
        onClick={handleClick}
        isDisabled={!currentUser?.uid}
      >
        Save Changes
      </Button>
    </VStack>
  );
}
