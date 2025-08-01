import React, { useState } from "react";
import { usePrice } from "../context/PriceContext";

const AdminPricePanel = () => {
  const { pricePerPageBlackwhite, pricePerPageColor, setPrices } = usePrice();
  const [blackwhite, setBlackwhite] = useState(pricePerPageBlackwhite);
  const [color, setColor] = useState(pricePerPageColor);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await setPrices(Number(blackwhite), Number(color));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Set Print Prices</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Black & White (per page)</label>
        <input
          type="number"
          min={0}
          value={blackwhite}
          onChange={e => setBlackwhite(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Color (per page)</label>
        <input
          type="number"
          min={0}
          value={color}
          onChange={e => setColor(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
      >
        {saving ? "Saving..." : "Save Prices"}
      </button>
      {success && <div className="text-green-600 mt-3">Prices updated!</div>}
    </div>
  );
};

export default AdminPricePanel;