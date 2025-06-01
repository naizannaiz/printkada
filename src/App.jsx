import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import UploadPage from "./pages/UploadPage";
import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PrintQueue from "./pages/PrintQueue";
import { PriceProvider } from "./context/PriceContext";
import { ShopStatusProvider } from "./context/ShopStatusContext";

function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  if (user === undefined) return null; // or loading spinner
  return user ? children : <Navigate to="/admin-login" />;
}

function App() {
  return (
    <PriceProvider>
      <ShopStatusProvider>
        <Router>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/print-queue" element={
              <PrivateRoute>
                <PrintQueue />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </ShopStatusProvider>
    </PriceProvider>
  );
}

export default App;