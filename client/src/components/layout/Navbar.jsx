import { Box, Flex, Link } from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";
import { NavLink, useLocation } from "react-router-dom";

const useIsActive = (pathname) => {
  const location = useLocation();
  return location.pathname === pathname;
};

export const Navbar = () => {
  const { currentUser } = useAuthContext();
  const { role, loading } = useRoleContext();
  const isQuotaActive = useIsActive("/quota-tracking");
  const isProviderActive = useIsActive("/provider-directory");
  const isUserActive = useIsActive("/user-directory");
  const isVersionActive = useIsActive("/version-log");
  const isSettingsActive = useIsActive("/settings");

  const getLinkProps = (isActive) => ({
    color: "white",
    px: 2,
    py: 1,
    borderRadius: "md",
    fontSize: { base: "8px", sm: "14px" },
    fontWeight: isActive ? "700" : "400",
    textDecoration: "none",
    _hover: {
      textShadow: "0 0 0.5px white, 0 0 0.5px white",
      textDecoration: "none",
    },
    _active: {
      fontWeight: "400",
    },
  });

  return (
    <>
      <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        h="200px"
        zIndex={9}
        pointerEvents="none"
        bgGradient="linear(to-t, white, transparent)"
      />
      <Flex
        position="fixed"
        bottom="5vh"
        left="50%"
        transform="translateX(-50%)"
        bg="black"
        w={{ base: "90%", md: "56%" }}
        h="60px"
        borderRadius="16px"
        align="center"
        justify="space-evenly"
        px={4}
        zIndex={10}
      >
        <Flex
          gap="3"
          width="100%"
          justify="space-evenly"
        >
          <Link
            as={NavLink}
            to="/quota-tracking"
            {...getLinkProps(isQuotaActive)}
          >
            Quota Tracking
          </Link>

          <Link
            as={NavLink}
            to="/provider-directory"
            {...getLinkProps(isProviderActive)}
          >
            Provider Directory
          </Link>

          {role === "master" || role === "ccm" ? (
            <>
              <Link
                as={NavLink}
                to="/user-directory"
                {...getLinkProps(isUserActive)}
              >
                User Directory
              </Link>
              <Link
                as={NavLink}
                to="/version-log"
                {...getLinkProps(isVersionActive)}
              >
                Version Log
              </Link>
            </>
          ) : (
            <></>
          )}

          <Link
            as={NavLink}
            to="/settings"
            {...getLinkProps(isSettingsActive)}
          >
            Settings
          </Link>
        </Flex>
      </Flex>
    </>
  );
};

export default Navbar;
