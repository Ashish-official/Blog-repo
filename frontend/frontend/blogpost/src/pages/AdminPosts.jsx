import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Api/Api.js";

const emptyForm = { title: "", description: "" };

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchPosts = async () => {
    const res = await Api.get("/api/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await Api.get("/api/posts");
        setPosts(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load posts");
      }
    };

    loadPosts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await Api.put(`/api/posts/${editingId}`, formData);
        setMessage("Post updated.");
      } else {
        await Api.post("/api/posts", formData);
        setMessage("Post created.");
      }

      resetForm();
      await fetchPosts();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Post save failed");
    }
  };

  const editPost = (post) => {
    setEditingId(post._id);
    setFormData({ title: post.title, description: post.description });
  };

  const deletePost = async (id) => {
    setError("");
    setMessage("");

    try {
      await Api.delete(`/api/posts/${id}`);
      setMessage("Post deleted.");
      await fetchPosts();
    } catch (err) {
      setError(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/">Home</Link>
      </nav>

      <section style={styles.panel}>
        <h1 style={styles.heading}>Posts</h1>
        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required style={styles.input} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required rows="5" style={styles.textarea} />
          <button type="submit" style={styles.primaryButton}>{editingId ? "Update Post" : "Create Post"}</button>
          {editingId && <button type="button" onClick={resetForm} style={styles.secondaryButton}>Cancel</button>}
        </form>
      </section>

      <section style={styles.grid}>
        {posts.map((post) => (
          <article key={post._id} style={styles.card}>
            <h2 style={styles.cardTitle}>{post.title}</h2>
            <p style={styles.cardText}>{post.description}</p>
            <div style={styles.actions}>
              <Link to={`/posts/${post._id}`}>View</Link>
              <button onClick={() => editPost(post)} style={styles.smallButton}>Edit</button>
              <button onClick={() => deletePost(post._id)} style={styles.dangerButton}>Delete</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

const styles = {
  page: { minHeight: "100vh", background: "#f5f7fb", padding: 24, boxSizing: "border-box", textAlign: "left" },
  nav: { display: "flex", gap: 16, marginBottom: 24 },
  panel: { background: "#fff", borderRadius: 8, padding: 20, marginBottom: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
  heading: { marginTop: 0 },
  form: { display: "grid", gap: 12 },
  input: { padding: 10, border: "1px solid #d1d5db", borderRadius: 6 },
  textarea: { padding: 10, border: "1px solid #d1d5db", borderRadius: 6, resize: "vertical" },
  primaryButton: { padding: 10, border: "none", borderRadius: 6, background: "#2563eb", color: "#fff", cursor: "pointer" },
  secondaryButton: { padding: 10, border: "1px solid #d1d5db", borderRadius: 6, background: "#fff", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 },
  card: { background: "#fff", borderRadius: 8, padding: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
  cardTitle: { marginTop: 0, fontSize: 22 },
  cardText: { color: "#4b5563" },
  actions: { display: "flex", gap: 12, alignItems: "center", marginTop: 14 },
  smallButton: { padding: "6px 10px", border: "none", borderRadius: 6, background: "#e0f2fe", cursor: "pointer" },
  dangerButton: { padding: "6px 10px", border: "none", borderRadius: 6, background: "#fee2e2", color: "#991b1b", cursor: "pointer" },
  error: { color: "#b91c1c" },
  success: { color: "#047857" },
};

export default AdminPosts;
