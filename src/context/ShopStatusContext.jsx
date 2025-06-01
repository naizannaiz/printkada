import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const ShopStatusContext = createContext();

export function ShopStatusProvider({ children }) {
  const [status, setStatusState] = useState("open");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "main"), (docSnap) => {
      if (docSnap.exists()) {
        setStatusState(docSnap.data().status || "open");
      }
    });
    return unsub;
  }, []);

  const setStatus = async (status) => {
    await setDoc(doc(db, "settings", "main"), { status }, { merge: true });
  };

  return (
    <ShopStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </ShopStatusContext.Provider>
  );
}

export function useShopStatus() {
  return useContext(ShopStatusContext);
}