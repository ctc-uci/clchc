import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";


import { auth } from "./firebase";

const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();

/**
 * `signInWithRedirect` is patched!
 *
 * @see {@link client/docs/signInWithRedirect.md} for more detailed documentation.
 */
// const patchedSignInWithRedirect = signInWithRedirect;

export async function authenticateFacebookUser() {
  await signInWithPopup(auth, facebookProvider);
}

export async function authenticateGoogleUser() {
  await signInWithPopup(auth, googleProvider);
}
