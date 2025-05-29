import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PriceProvider } from "./context/PriceContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PriceProvider>
      <App />
    </PriceProvider>
  </React.StrictMode>
);