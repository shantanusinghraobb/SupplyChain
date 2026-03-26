import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login/`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Save JWT tokens
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", res.data.username);

      window.location.href = "/";
    } catch (err) {
      toast.error("❌ Wrong username or password", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ REQUIRED FOR TOASTS */}
      <ToastContainer />

      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            width: "350px",
            padding: "30px",
            borderRadius: "12px",
            background: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Welcome</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                margin: "10px 0",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "16px",
                background: "white",
                color: "black",
              }}
            />

            <div style={{ position: "relative", margin: "10px 0" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  background: "white",
                  color: "black",
                }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                👁
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading ? "#aaa" : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                marginTop: "10px",
              }}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
