import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-gray-100 py-4 mt-8 text-center">
    <div className="flex flex-wrap justify-center gap-4">
      <Link to="/privacy-policy">Privacy Policy</Link>
      <Link to="/terms-and-conditions">Terms and Conditions</Link>
      <Link to="/cancellation-refund">Cancellation & Refund</Link>
      <Link to="/shipping-delivery">Shipping & Delivery</Link>
      <Link to="/contact-us">Contact Us</Link>
    </div>
    <div className="mt-2 text-sm text-gray-500">
      &copy; {new Date().getFullYear()} College Printing Shop
    </div>
  </footer>
);

export default Footer;