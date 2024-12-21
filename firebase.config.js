
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: 'AIzaSyB02Yf2Gmyx0L0pTRBCrUo9Lr52oDeIHuA',
  apiKey: 'AIzaSyDX4utP4j4Gro5MiL7x6xEUaxCsT0e7sT0',
  authDomain: 'kwibal.firebaseapp.com',
  projectId: 'kwibal',
  storageBucket: 'kwibal.appspot.com',
  // storageBucket: 'kwibal.firebasestorage.app',
  messagingSenderId: '383077171790',
  appId: '1:383077171790:web:5c552bf0591807f03fb91f',
  measurementId: 'G-EJ7MWNFQNY',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);