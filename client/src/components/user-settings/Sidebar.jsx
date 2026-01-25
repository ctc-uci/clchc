import React from "react";
import {
    Flex,
    Avatar,
    Button,
    Text,
    VStack
} from "@chakra-ui/react";
import { PERSONAL_INFO, CALCULATION_FACTOR, DELETE_ACCOUNT } from "./Settings";

export default function Sidebar({ currentView, setCurrentView }) {

    const User = () => (
        <VStack align="center">
            <Avatar size="2xl" />
            <Text>First Last</Text>
            <Text>Role</Text>
        </VStack>
    )

    const NavButtons = () => (
        <VStack align="stretch" spacing="1em">
            <Button onClick={() => setCurrentView(PERSONAL_INFO)}>Personal Information</Button>
            <Button onClick={() => setCurrentView(CALCULATION_FACTOR)}>Calculation Factor</Button>
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