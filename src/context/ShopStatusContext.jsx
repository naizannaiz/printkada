import React, { createContext, useContext, useState } from "react";

const ShopStatusContext = createContext();

export const ShopStatusProvider = ({ children }) => {
  const [status, setStatus] = useState("open"); // "open" or "closed"
  return (
    <ShopStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </ShopStatusContext.Provider>
  );
};

export const useShopStatus = () => useContext(ShopStatusContext);