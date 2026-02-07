export type User = {
  id: number;
  email: string;
  firebaseUid: string;
  role: "master" | "ccm" | "ccs" | "viewer";
};
