import React, { useState } from "react";
import { usePrice } from "../context/PriceContext";

const AdminDashboard = () => {
  const { pricePerPage, setPricePerPage } = usePrice();
  const [input, setInput] = useState(pricePerPage);

  const handleChange = (e) => setInput(e.target.value);
  const handleSave = () => setPricePerPage(Number(input));

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Set Price Per Page</h2>
      <input type="number" value={input} onChange={handleChange} min={1} />
      <button onClick={handleSave}>Save</button>
      <p>Current Price Per Page: ₹{pricePerPage}</p>
    </div>
  );
};

export default AdminDashboard;