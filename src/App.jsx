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
import CheckStatus from "./pages/CheckStatus";
import AdminPricePanel from "./pages/AdminPricePanel";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import CancellationRefund from "./components/CancellationRefund";
import ShippingDelivery from "./components/ShippingDelivery";
import ContactUs from "./components/ContactUs";
import { PriceProvider } from "./context/PriceContext";
import { ShopStatusProvider } from "./context/ShopStatusContext";
import Footer from "./components/Footer";

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
            <Route path="/check-status" element={<CheckStatus />} />
            <Route path="/admin-price" element={
              <PrivateRoute>
                <AdminPricePanel />
              </PrivateRoute>
            } />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/cancellation-refund" element={<CancellationRefund />} />
            <Route path="/shipping-delivery" element={<ShippingDelivery />} />
            <Route path="/contact-us" element={<ContactUs />} />
          </Routes>
          <Footer />
        </Router>
      </ShopStatusProvider>
    </PriceProvider>
  );
}

export default App;