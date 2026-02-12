import { Box } from "@chakra-ui/react"

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
    return (
        <Box minH="100vh" paddingBottom="calc(5vh + 80px)">
            <Navbar/>
            <Outlet/>
        </Box>
    );
}

export default Layout;