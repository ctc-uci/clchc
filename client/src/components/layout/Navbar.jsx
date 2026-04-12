import { Flex, Link } from "@chakra-ui/react";

import { useUserContext } from "@/contexts/hooks/useUserContext";
import { NavLink, useLocation } from "react-router-dom";

const useIsActive = (pathname) => {
  const location = useLocation();
  return (
    location.pathname === pathname ||
    location.pathname.startsWith(`${pathname}/`)
  );
};

export const Navbar = () => {
  const { role } = useUserContext();

  const savedQuotaDate = sessionStorage.getItem("quotaDate") || "";

  const isQuotaActive = useIsActive("/quota-tracking");
  const isProviderActive = useIsActive("/provider-directory");
  const isUserActive = useIsActive("/user-directory");
  const isVersionActive = useIsActive("/version-log");
  const isSettingsActive = useIsActive("/settings");

  const getLinkProps = (isActive) => ({
    color: isActive ? "#113D64" : "#000",
    fontFamily: "Lato",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: isActive ? "700" : "400",
    lineHeight: "normal",
    py: "3.6px",
    textDecoration: "none",
    whiteSpace: "nowrap",
    _hover: {
      textDecoration: "none",
      color: "#113D64",
    },
  });

  return (
    <Flex
      flex="1"
      align="flex-end"
      justify="flex-end"
      gap="30px"
      flexWrap="wrap"
      py="31px"
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
