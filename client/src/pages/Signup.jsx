import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/authService";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await signup(name, email, password, role);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
  <form onSubmit={handleSubmit}>
    <h1>Create your account</h1>
    {error && <p className="error">{error}</p>}

    <label>
      Name
      <input
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
    </label>

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
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </label>

    <label>
      Account type
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">Attendee: I want to book events</option>
        <option value="organizer">Organizer: I want to create events</option>
      </select>
    </label>

    <button type="submit">Create account</button>
  </form>
);
}

export default Signup;