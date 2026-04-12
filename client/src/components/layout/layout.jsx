import { Box, Image } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

const Layout = () => {
  return (
    <Box
      minH="100vh"
      paddingBottom="calc(5vh + 80px)"
    >
      <Box
        bg="white"
        display="flex"
        width="100%"
        padding="10px 40px"
        alignItems="center"
        justifyContent="space-between"
        gap={8}
      >
        <Image
          src="/clchc-logo.png"
          alt="Celebrating Life Community Health Center"
          height="88px"
          width="auto"
          display="block"
          flexShrink={0}
        />
        <Navbar />
      </Box>
      <Outlet />
    </Box>
  );
};

export default Layout;
