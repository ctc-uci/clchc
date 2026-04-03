import { Flex, Link } from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useUserContext } from "@/contexts/hooks/useUserContext";
import { NavLink, useLocation } from "react-router-dom";

const useIsActive = (pathname) => {
  const location = useLocation();
  return location.pathname === pathname || location.pathname.startsWith(`${pathname}/`);
};

export const Navbar = () => {
  const { currentUser } = useAuthContext();
  const { role, loading } = useUserContext();

  const savedQuotaDate = sessionStorage.getItem("quotaDate") || "";

  const isQuotaActive = useIsActive("/quota-tracking");
  const isProviderActive = useIsActive("/provider-directory");
  const isUserActive = useIsActive("/user-directory");
  const isVersionActive = useIsActive("/version-log");
  const isSettingsActive = useIsActive("/settings");

  const getLinkProps = (isActive) => ({
    color: isActive ? "#1f4672" : "#111111",
    px: 2,
    py: 1,
    borderRadius: "md",
    // fontSize: { base: "12px", sm: "16px", md: "18px" },
    fontSize: "18px",

    fontWeight: isActive ? "700" : "400",
    textDecoration: "none",
    whiteSpace: "nowrap",
    _hover: {
      color: "#1f4672",
      textDecoration: "none",
    },
    _active: {
      color: "#1f4672",
    },
  });

  return (
    <Flex
      w="100%"
      align="center"
      justify="flex-end"
      gap={{ base: 4, md: 8 }}
      flexWrap="wrap"
    >
      <Link
        as={NavLink}
        to={`/quota-tracking/${savedQuotaDate}`}
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
            Audit Log
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
  );
};

export default Navbar;
