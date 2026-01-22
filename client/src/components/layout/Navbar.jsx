import { Flex, Link } from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
  const { currentUser } = useAuthContext();
  const { role, loading } = useRoleContext();

  const baseLinkProps = {
    color: "white",
    px: 2,
    py: 1,
    borderRadius: "md",
    fontSize: { base: "8px", sm: "14px" },
    _hover: { textDecoration: "underline", textUnderlineOffset: "3px" },
  };

  const activeStyle = ({ isActive }) =>
    isActive
      ? {
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          fontWeight: "600",
        }
      : undefined;

  return (
    <Flex
      // Positioning
      position="fixed"
      bottom="5vh" // Replaces marginTop: stays near bottom regardless of screen height
      left="50%" // Moves to center
      transform="translateX(-50%)" // Perfectly centers the bar
      // Styling
      bg="black"
      w={{ base: "90%", md: "56%" }} // Wider on mobile (90%), thinner on desktop (56%)
      h="60px" // Fixed height is usually safer for navbars than %
      borderRadius="16px"
      align="center"
      justify="space-evenly"
      px={4}
    >
      <Flex
        gap="3"
        width="100%"
        justify="space-evenly"
      >
        <Link
          as={NavLink}
          to="/quota-tracking"
          style={activeStyle}
          {...baseLinkProps}
        >
          Quota Tracking
        </Link>

        <Link
          as={NavLink}
          to="/provider-directory"
          style={activeStyle}
          {...baseLinkProps}
        >
          Provider Directory
        </Link>

        {role !== "viewer" && role !== "ccs" ? (
          <>
            <Link
              as={NavLink}
              to="/user-directory"
              style={activeStyle}
              {...baseLinkProps}
            >
              User Directory
            </Link>
            <Link
              as={NavLink}
              to="/version-log"
              style={activeStyle}
              {...baseLinkProps}
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
          style={activeStyle}
          {...baseLinkProps}
        >
          Settings
        </Link>
      </Flex>
    </Flex>
  );
};

export default Navbar;
