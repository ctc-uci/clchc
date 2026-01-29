import React from "react";
import {
    Flex,
    Avatar,
    Button,
    Text,
    VStack
} from "@chakra-ui/react";
import { PERSONAL_INFO, CALCULATION_FACTOR, DELETE_ACCOUNT } from "./Settings";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";

export default function Sidebar({ currentView, setCurrentView }) {
    const { currentUser } = useAuthContext(); // deconstructing context to get user info
    const { role } = useRoleContext();
    const User = () => (
        <VStack align="center">
            <Avatar size="2xl" />
            <Text>{currentUser.displayName || currentUser.email}</Text>
            <Text>{role}</Text>
        </VStack>
    )

    const FactorButton = () => {
        return role === "ccm" || role === "master"
            ? <Button onClick={() => setCurrentView(CALCULATION_FACTOR)}>Calculation Factor</Button>
            : null;
    }

    const NavButtons = () => (
        <VStack align="stretch" spacing="1em">
            <Button onClick={() => setCurrentView(PERSONAL_INFO)}>Personal Information</Button>
            <FactorButton />
            <Button>Log out</Button>
            <Button onClick={() => setCurrentView(DELETE_ACCOUNT)}>Delete Account</Button>
        </VStack>
    )

    return (
        <VStack
            align="stretch"
            spacing="2em"
            backgroundColor="#ddd"
            borderRadius="1em"
            padding="1.5em"
        >
            <User />
            <NavButtons />
        </VStack>
    )
}