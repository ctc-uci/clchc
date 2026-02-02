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

import useFactor from "./useFactor";
import useUser from "./useUser";

export default function QuotaCalcFactor() {
  const { userInfo, updateQuota } = useUser();
  const { factor, setFactor } = useFactor(userInfo);

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
