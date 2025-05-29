import React, { createContext, useContext, useState } from "react";

// Create the context
const PriceContext = createContext();

// Custom hook to use the context
export const usePrice = () => useContext(PriceContext);

// Provider component
export const PriceProvider = ({ children }) => {
  const [pricePerPage, setPricePerPage] = useState(2); // Default price

  return (
    <PriceContext.Provider value={{ pricePerPage, setPricePerPage }}>
      {children}
    </PriceContext.Provider>
  );
};