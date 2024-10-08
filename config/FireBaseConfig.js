// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArA8DxiYtOT5PcZRTVMdibIAMYh2xdnI4",
  authDomain: "react-native-1468b.firebaseapp.com",
  projectId: "react-native-1468b",
  storageBucket: "react-native-1468b.appspot.com",
  messagingSenderId: "922205883159",
  appId: "1:922205883159:web:60f30575005daba6ff8552",
  measurementId: "G-DWLN5Z68PB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);
