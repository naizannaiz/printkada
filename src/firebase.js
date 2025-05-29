import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDbcUyuHWOXF_RA8ZDN3CiheJPjEzWdpAU",
  authDomain: "printshop-10.firebaseapp.com",
  projectId: "printshop-10",
  storageBucket: "printshop-10.firebasestorage.app",
  messagingSenderId: "668535834094",
  appId: "1:668535834094:web:f809000483df0979fdfaff",
  measurementId: "G-B6GY0FBRVB"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);