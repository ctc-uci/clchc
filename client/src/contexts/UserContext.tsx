import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { Spinner } from "@chakra-ui/react";

import type { User as DbUser } from "../types/user";
import { auth } from "../utils/auth/firebase";
import { useBackendContext } from "./hooks/useBackendContext";

type DbUserRole = DbUser["role"];

interface UserContextProps {
  dbUser: DbUser | null;
  role: DbUserRole | null;
  status: DbUser["status"] | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { backend } = useBackendContext();

  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Lwk just exposing role and status because they are fetched a lot
  const role = dbUser?.role ?? null;
  const status = dbUser?.status ?? null;

  const fetchUser = useCallback(
    async (uid: string) => {
      try {
        const response = await backend.get(`/users/firebase/${uid}`);
        const user = (response.data as DbUser[]).at(0) ?? null;
        setDbUser(user);
      } catch (e) {
        console.error(`Error fetching role: ${e.message}`);
        setDbUser(null);
      }
    },
    [backend]
  );

  const refetch = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      await fetchUser(user.uid);
    }
  }, [fetchUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          await fetchUser(user.uid);
        } else {
          setDbUser(null);
        }
      } catch (e) {
        console.error(`Error setting role: ${e.message}`);
        setDbUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [backend, fetchUser]);

  const value: UserContextProps = {
    dbUser,
    role,
    status,
    loading,
    refetch,
  };

  return (
    <UserContext.Provider value={value}>
      {loading ? <Spinner /> : children}
    </UserContext.Provider>
  );
};
