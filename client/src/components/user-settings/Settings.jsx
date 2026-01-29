import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {
    Box,
    Flex,
    Grid,
    Button
} from "@chakra-ui/react";
import Sidebar from "./Sidebar.jsx";
import View from "./View.jsx";

export const PERSONAL_INFO = "personal-info";
export const DELETE_ACCOUNT = "delete-account";
export const CALCULATION_FACTOR = "calculation-factor";

export function Settings({view=PERSONAL_INFO}) {
    // State to determine which "tab" being shown in the View.
    const [currentView, setCurrentView] = useState(view);
    console.log(currentView);
    return(
        <Grid
        templateColumns="auto 1fr">
            <Sidebar
                currentView={currentView}
                setCurrentView={setCurrentView}
            />
            <View currentView={currentView}/>
        </Grid>
    )
};