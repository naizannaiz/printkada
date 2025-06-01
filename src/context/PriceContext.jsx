import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Create the context
const PriceContext = createContext();

// Provider component
export function PriceProvider({ children }) {
  const [pricePerPage, setPricePerPageState] = useState(1);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "main"), (docSnap) => {
      if (docSnap.exists()) {
        setPricePerPageState(docSnap.data().pricePerPage || 1);
      }
    });
    return unsub;
  }, []);

  const setPricePerPage = async (price) => {
    await setDoc(doc(db, "settings", "main"), { pricePerPage: price }, { merge: true });
  };

  return (
    <PriceContext.Provider value={{ pricePerPage, setPricePerPage }}>
      {children}
    </PriceContext.Provider>
  );
}

// Custom hook to use the context
export function usePrice() {
  return useContext(PriceContext);
}