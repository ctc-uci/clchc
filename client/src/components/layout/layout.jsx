import { Box, Image } from "@chakra-ui/react"
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
    return (
        <Box
            minH="100vh"
            paddingBottom="calc(5vh + 80px)"
        >
            <Box
                display="inline-flex"
                width="100%"
                padding="9px 40px"
                alignItems="center"
                justifyContent="space-between"
            >
                <Image
                    src="clchc-logo.svg"
                    width="250px"
                    height="94px"
                    pr="40px"
                    pt="9px"
                    pb="9px"
                />
                <Navbar/>
            </Box>
            <Outlet/>
        </Box>
    );
}

export default Layout;
