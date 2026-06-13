import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebase";

// ======================
// Register User
// ======================

export const registerUser = async (
  name,
  email,
  password
) => {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  await updateProfile(userCredential.user, {
    displayName: name,
  });

  return userCredential.user;
};

// ======================
// Login User
// ======================

export const loginUser = async (
  email,
  password
) => {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return userCredential.user;
};

// ======================
// Logout User
// ======================

export const logoutUser = async () => {
  await signOut(auth);
};

// ======================
// Google Login
// ======================

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(
    auth,
    provider
  );

  return result.user;
};

// ======================
// Auth State Listener
// ======================

export const authListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};