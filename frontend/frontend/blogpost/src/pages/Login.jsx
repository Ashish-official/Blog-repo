import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../Api/Api.js";
import { AuthContext } from "../context/AuthContext.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await Api.post("/api/auth/login", formData);
      login(res.data);
      navigate(res.data.user.roles === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <label style={styles.label}>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button disabled={submitting} type="submit" style={styles.button}>
          {submitting ? "Signing in..." : "Sign In"}
        </button>
        <p style={styles.text}>
          Need an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: 20,
  },
  form: {
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: 380,
    maxWidth: "100%",
    textAlign: "left",
  },
  title: { textAlign: "center", marginBottom: "1.5rem" },
  label: { display: "block", marginBottom: 6, color: "#374151", fontSize: 14 },
  input: {
    width: "100%",
    padding: "0.75rem",
    boxSizing: "border-box",
    marginBottom: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: 6,
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  error: { color: "#b91c1c", marginBottom: 12, textAlign: "center" },
  text: { marginTop: "1rem", textAlign: "center", fontSize: 14 },
};

export default LoginPage;
