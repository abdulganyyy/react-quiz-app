import React, { useState } from "react";

export default function StartPage({ username, onStart, onResume, hasResume, onLogout }) {
  const [amount, setAmount] = useState(10);
  const [type, setType] = useState("multiple");

  const handleStart = (e) => {
    e.preventDefault();
    onStart({ amount: Number(amount), type });
  };

  return (
    <div className="card">
      <h2>Start Page</h2>
      <p className="muted">Hi, <b>{username}</b>. Pilih setting kuis dulu ya.</p>

      <form onSubmit={handleStart} className="form">
        <label>
          Jumlah Soal
          <input
            type="number"
            min={5}
            max={30}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <label>
          Tipe Soal
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="multiple">Multiple Choice</option>
            <option value="boolean">True / False</option>
          </select>
        </label>

        <button type="submit" className="btn">
          Start Kuis
        </button>

        {hasResume && (
          <button type="button" className="btn secondary" onClick={onResume}>
            Resume Kuis
          </button>
        )}

        <button type="button" className="btn secondary" onClick={onLogout}>
          Logout
        </button>
      </form>

      <div className="tips">
        Resume akan muncul jika ada kuis yang belum selesai (tersimpan di localStorage).
      </div>
    </div>
  );
}
