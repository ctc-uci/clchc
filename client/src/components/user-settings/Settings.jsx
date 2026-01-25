import React, {useState} from "react";
import {
    Box,
    Flex,
    Button
} from "@chakra-ui/react";
import Sidebar from "./Sidebar.jsx";

export const PERSONAL_INFO = "personal-info";
export const DELETE_ACCOUNT = "delete-account";
export const CALCULATION_FACTOR = "calculation-factor";

export default function Settings() {
    // State to determine which "tab" being shown in the View.
    const [currentView, setCurrentView] = useState(PERSONAL_INFO);
    
    return(
        <Box>
            <Flex>The View: {currentView}</Flex>
            <Sidebar
                currentView={currentView}
                setCurrentView={setCurrentView}
            />
        </Box>
    )
}