import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyBLc7wEJWyATG_mOkY30fNayGUKR4nHXFI",
    authDomain: "saylani-admin-panel.firebaseapp.com",
    projectId: "saylani-admin-panel",
    storageBucket: "saylani-admin-panel.appspot.com",
    messagingSenderId: "100325430931",
    appId: "1:100325430931:web:40da118e1e10aa27751f66",
    measurementId: "G-J57EH5CWC1"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)
export { auth, db, storage }