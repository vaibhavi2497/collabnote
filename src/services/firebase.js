import { initializeApp } from "firebase/app";

import {
  initializeFirestore,
} from "firebase/firestore";

import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDHAuYM7Q2SYoUdudjuC71pL6F029ZK0x4",

  authDomain: "collab-notes-app-cba50.firebaseapp.com",

  projectId: "collab-notes-app-cba50",

  storageBucket: "collab-notes-app-cba50.firebasestorage.app",

  messagingSenderId: "905140748531",

  appId: "1:905140748531:web:4a1ab91d1cff4267573786",
};

const app = initializeApp(firebaseConfig);

// ✅ Firestore Fix
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// ✅ Authentication
export const auth = getAuth(app);

// ✅ Storage
export const storage = getStorage(app);

// ✅ Auth persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence enabled");
  })
  .catch((error) => {
    console.log(error);
  });