import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div>
       <h1>Create account</h1>
       <form onSubmit={handleSubmit}>
         <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
         {error && <p className="error">{error}</p>}
         <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
       </form>
       <p>Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}