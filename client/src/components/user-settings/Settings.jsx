import React, {useState} from "react";
import {Grid} from "@chakra-ui/react";
import Sidebar from "./Sidebar.jsx";
import View from "./View.jsx";

export const PERSONAL_INFO = "personal-info";
export const DELETE_ACCOUNT = "delete-account";
export const CALCULATION_FACTOR = "calculation-factor";

export function Settings({ view = PERSONAL_INFO }) {
    // State to determine which "tab" being shown in the View.
    const [currentView, setCurrentView] = useState(view);
    return (
        <Grid
            templateColumns="auto 1fr"
            padding="2em"
            gap="2em"
        >
            <Sidebar
                currentView={currentView}
                setCurrentView={setCurrentView}
            />
            <View currentView={currentView} />
        </Grid>
    )
};