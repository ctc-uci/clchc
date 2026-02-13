export type User = {
  id: number;
  email: string;
  firebaseUid: string;
  role: "master" | "ccm" | "ccs" | "viewer";
  firstName: string;
  lastName: string;
  status: "approved" | "pending" | "rejected";
  apptCalcFactor: number | null;
};
