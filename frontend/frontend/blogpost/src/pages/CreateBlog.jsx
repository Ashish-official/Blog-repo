import { useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Api/Api.js";

const CreateBlog = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      await Api.post("/api/posts", formData);
      setFormData({ title: "", description: "" });
      setMessage("Blog post created successfully.");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Post failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/admin">Admin Dashboard</Link>
      </nav>
      <section style={styles.panel}>
        <h1 style={styles.heading}>Create Blog Post</h1>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handlePost}>
          <label style={styles.label}>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="8"
            required
            style={styles.textarea}
          />
          <button disabled={submitting} type="submit" style={styles.button}>
            {submitting ? "Posting..." : "Post Blog"}
          </button>
        </form>
      </section>
    </main>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: 24,
    boxSizing: "border-box",
  },
  nav: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    marginBottom: 24,
  },
  panel: {
    maxWidth: 720,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    padding: 24,
    textAlign: "left",
  },
  heading: { marginTop: 0, textAlign: "center", fontSize: 32 },
  label: { display: "block", marginBottom: 6, color: "#374151", fontSize: 14 },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    boxSizing: "border-box",
    resize: "vertical",
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
  },
  success: { color: "#047857", textAlign: "center", marginBottom: 16 },
  error: { color: "#b91c1c", textAlign: "center", marginBottom: 16 },
};

export default CreateBlog;
