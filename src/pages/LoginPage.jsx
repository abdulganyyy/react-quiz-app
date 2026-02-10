import React, { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) return alert("Isi username dulu ya.");
    if (!password.trim()) return alert("Isi password dulu ya.");

    // Challenge: login sederhana (tanpa backend)
    onLogin({ username: username.trim() });
  };

  return (
    <div className="card">
      <h2>Login</h2>

      <form onSubmit={handleLogin} className="form">
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="contoh: alexa"
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="btn">
          Login
        </button>
      </form>

      <div className="tips">
        Setelah login, kamu bisa pilih jumlah soal, tipe soal, dan opsi resume.
      </div>
    </div>
  );
}
