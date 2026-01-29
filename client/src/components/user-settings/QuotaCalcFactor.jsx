import React, { useState, useEffect } from "react";
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Flex,
    VStack,
    Button,
    Text
} from "@chakra-ui/react";
import useUser from "./useUser";
import useFactor from "./useFactor";

export default function QuotaCalcFactor() {
    const { userInfo, updateQuota } = useUser();
    const { factor, setFactor } = useFactor(userInfo);

    const handleClick = async () => {
        await updateQuota(factor);
        alert("Changes saved.");
    }

    return (
        <VStack>
            <Text>Quota Calculation Factor</Text>
            <Text>This value...overriden</Text>
            <NumberInput
                value={factor}
                onChange={(_, val) => setFactor(val)}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>

            <Button onClick={handleClick}>Save Changes</Button>
        </VStack>
    )
}