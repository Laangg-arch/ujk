// lib/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCDcpVLZf8lbeeHWdmyhSsVFOcCF4ICpxc",
  authDomain: "gudang-sparepart.firebaseapp.com",
  projectId: "gudang-sparepart",
  storageBucket: "gudang-sparepart.firebasestorage.app",
  messagingSenderId: "808988257586",
  appId: "1:808988257586:web:1acbaeacd129095f72bb2b",
  measurementId: "G-CYVVNCRPWQ",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export default app;
