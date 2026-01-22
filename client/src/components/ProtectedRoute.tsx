import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";
import { Navigate } from "react-router-dom";

import type { User as DbUser } from "../types/user";

type DbUserRole = DbUser["role"];

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles?: DbUserRole | DbUserRole[];
}

export const ProtectedRoute = ({
  element,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const { currentUser } = useAuthContext();
  const { role } = useRoleContext();

  const roles: DbUserRole[] = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];
  const isValidRole = getIsValidRole(roles, role);
  return currentUser && isValidRole ? (
    element
  ) : currentUser ? (
    <Navigate to={"dashboard"} />
  ) : (
    <Navigate to={"/"} />
  );
};

/**
 * Helper function for determining if a user may access a route based on their role.
 * If no allowed roles are specified, or if the user is an admin, they are authorized. Otherwise, their role must be within the list of allowed roles.
 *
 * @param roles a list of roles which may access this route
 * @param role the current user's role
 */

const ROLE_HIERARCHY: Record<DbUserRole, number> = {
  master: 4,
  ccm: 3,
  ccs: 2,
  viewer: 1,
};

const hasPermission = (
  userRole: DbUserRole,
  requiredRole: DbUserRole
): boolean => {
  if (userRole === "master") return true;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

function getIsValidRole(roles: DbUserRole[], role: DbUserRole | undefined) {
  // No roles specified = public route
  if (roles.length === 0) return true;

  // No role = unauthorized
  if (!role) return false;

  // Check if user's role meets ANY of the required roles hierarchically
  return roles.some((requiredRole) => hasPermission(role, requiredRole));
}
