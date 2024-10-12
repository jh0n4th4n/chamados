
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCBUu2Q8Zw-6PH9t3_RvFaNzOzdHvm9xjo",
  authDomain: "ticktes-d47b3.firebaseapp.com",
  projectId: "ticktes-d47b3",
  storageBucket: "ticktes-d47b3.appspot.com",
  messagingSenderId: "539026016547",
  appId: "1:539026016547:web:78a254ca3586293930e496",
  measurementId: "G-5BTZ33QGCR"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };