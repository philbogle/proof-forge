// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'studio-6056350319-b66ce',
  appId: '1:546099671800:web:1f64e18b83b7e4be97010d',
  storageBucket: 'studio-6056350319-b66ce.firebasestorage.app',
  apiKey: 'AIzaSyAtdoKH86Xt7eBi4wuf4cpnRzrNZzMg6js',
  authDomain: 'studio-6056350319-b66ce.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '546099671800',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
