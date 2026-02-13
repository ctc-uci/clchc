import { useContext } from "react";

import { UserContext } from "@/contexts/UserContext";

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within an UserProvider");
  }

  return context;
};
