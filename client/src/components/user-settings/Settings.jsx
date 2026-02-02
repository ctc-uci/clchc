import React, { useEffect, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { Grid } from "@chakra-ui/react";
import Sidebar from "./Sidebar.jsx";
import View from "./View.jsx";

export const PERSONAL_INFO = "personal-info";
export const DELETE_ACCOUNT = "delete-account";
export const CALCULATION_FACTOR = "calculation-factor";

export function Settings({ view = PERSONAL_INFO }) {
    // State to determine which "tab" being shown in the View.
    const [currentView, setCurrentView] = useState(view);
    const location = useLocation();
    useEffect(() => {
        // Uses routerdom to extract the URL's section parameter and set currentView to that section
        const match = matchPath(
            { path: "/user-settings/:section", end: true },
            location.pathname
        );
        setCurrentView(match?.params?.section);
    }, [location]);

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