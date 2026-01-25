import React from "react";
import {
    Flex,
    Button
} from "@chakra-ui/react";
import { PERSONAL_INFO, CALCULATION_FACTOR, DELETE_ACCOUNT } from "./Settings";

export default function Sidebar({currentView, setCurrentView}) {
    return(
        <Flex>
            <Button onClick={() => setCurrentView(PERSONAL_INFO)}>Personal Information</Button>
            <Button onClick={() => setCurrentView(CALCULATION_FACTOR)}>Calculation Factor</Button>
            <Button>Log out</Button>
            <Button onClick={() => setCurrentView(DELETE_ACCOUNT)}>Delete Account</Button>
        </Flex>
    )
}