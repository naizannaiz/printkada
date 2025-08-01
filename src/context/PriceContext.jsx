import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Create the context
const PriceContext = createContext();

// Provider component
export function PriceProvider({ children }) {
  const [pricePerPageBlackwhite, setPricePerPageBlackwhite] = useState(1);
  const [pricePerPageColor, setPricePerPageColor] = useState(5);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "main"), (docSnap) => {
      if (docSnap.exists()) {
        setPricePerPageBlackwhite(docSnap.data().pricePerPageBlackwhite || 1);
        setPricePerPageColor(docSnap.data().pricePerPageColor || 5);
      }
    });
    return unsub;
  }, []);

  const setPrices = async (blackwhite, color) => {
    await setDoc(
      doc(db, "settings", "main"),
      { pricePerPageBlackwhite: blackwhite, pricePerPageColor: color },
      { merge: true }
    );
  };

  return (
    <PriceContext.Provider
      value={{
        pricePerPageBlackwhite,
        pricePerPageColor,
        setPrices,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
}

// Custom hook to use the context
export function usePrice() {
  return useContext(PriceContext);
}