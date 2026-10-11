import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
  <form onSubmit={handleSubmit}>
    <h1>Log in</h1>
    {error && <p className="error">{error}</p>}

    <label>
      Email
      <input
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </label>

    <label>
      Password
      <input
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </label>

    <button type="submit">Log in</button>
  </form>
);
}

export default Login;