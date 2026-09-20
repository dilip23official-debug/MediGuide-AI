import { useState } from "react";
import api from "./api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      setMessage("Login successful! ✅");

      onLogin();
    } catch (error) {
      setMessage(
        `Login failed: ${error.response?.status || "No response"} - ${
          error.response?.data
            ? JSON.stringify(error.response.data)
            : error.message
        }`
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>
          Medi<span>Guide</span> AI
        </h1>

        <p>Sign in to your account</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Login;
