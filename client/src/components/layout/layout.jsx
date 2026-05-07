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
                px="40px"
                pt="9px"
                pb="0"
                alignItems="center"
                justifyContent="space-between"
            >
                <Image
                    src="/navbar-clchc-logo.png"
                    width="250px"
                    height="94px"
                    objectFit="contain"
                />
                <Navbar/>
            </Box>
            <Outlet/>
        </Box>
    );
}

export default Layout;
