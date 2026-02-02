import { createContext, ReactNode, useEffect, useState } from "react";

import { Spinner } from "@chakra-ui/react";

import type { User as DbUser, User } from "../types/user";
import { auth } from "../utils/auth/firebase";
import { useBackendContext } from "./hooks/useBackendContext";

type DbUserRole = DbUser["role"];

interface RoleContextProps {
  role: DbUserRole | undefined;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const RoleContext = createContext<RoleContextProps | null>(null);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { backend } = useBackendContext();

  const [role, setRole] = useState<DbUserRole | undefined>();
  const [loading, setLoading] = useState(true);

  const fetchRole = async (uid: string) => {
    try {
      const response = await backend.get(`/users/${uid}`);
      setRole((response.data as User[]).at(0)?.role);
    } catch (e) {
      console.error(`Error fetching role: ${e.message}`);
      setRole(undefined);
    }
  };

  const refetch = async () => {
    const user = auth.currentUser;
    if (user) {
      await fetchRole(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          fetchRole(user.uid);
        } else {
          setRole(undefined);
        }
      } catch (e) {
        console.error(`Error setting role: ${e.message}`);
        setRole(undefined);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [backend]);

  return (
    <RoleContext.Provider value={{ role, loading, refetch }}>
      {loading ? <Spinner /> : children}
    </RoleContext.Provider>
  );
};
