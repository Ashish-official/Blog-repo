import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../Api/Api.js";
import { AuthContext } from "../context/AuthContext.js";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "user",
  });
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
      const res = await Api.post("/api/auth/register", formData);
      login(res.data);
      navigate(res.data.user.roles === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button disabled={submitting} type="submit" style={styles.button}>
          {submitting ? "Creating..." : "Sign Up"}
        </button>
        <p style={styles.text}>
          Already have an account? <Link to="/login">Log in</Link>
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
    textAlign: "center",
  },
  title: { marginBottom: "1.5rem" },
  input: {
    width: "100%",
    padding: 12,
    margin: "8px 0",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 8,
  },
  error: { color: "#b91c1c", marginBottom: 12 },
  text: { marginTop: "1rem", fontSize: 14 },
};

export default Signup;
