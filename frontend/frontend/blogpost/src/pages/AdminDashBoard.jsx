import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Api/Api.js";
import { AuthContext } from "../context/AuthContext.js";

function AdminDashBoard() {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          Api.get("/api/users/all"),
          Api.get("/api/blogs"),
        ]);

        setUsers(usersRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <strong>Admin Dashboard</strong>
        <span>{user?.email}</span>
        <Link to="/">Home</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/posts">Posts</Link>
        <Link to="/create-blog">Create Blog</Link>
        <button onClick={logout} style={styles.linkButton}>Logout</button>
      </nav>

      {loading && <p>Loading dashboard...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          <section style={styles.stats}>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{users.length}</span>
              <span>Total Users</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNumber}>{posts.length}</span>
              <span>Total Blog Posts</span>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Users</h2>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item._id || item.id}>
                      <td style={styles.td}>{item.userName}</td>
                      <td style={styles.td}>{item.email}</td>
                      <td style={styles.td}>{item.roles}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Blog Posts</h2>
            <div style={styles.grid}>
              {posts.map((post) => (
                <article key={post._id} style={styles.post}>
                  <h3 style={styles.postTitle}>{post.title}</h3>
                  <p style={styles.postText}>{post.description}</p>
                  <small>
                    By {post.author?.userName || "Unknown"} on{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </small>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: 24,
    boxSizing: "border-box",
    textAlign: "left",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    background: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    padding: 0,
    font: "inherit",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statBox: {
    background: "#fff",
    borderRadius: 8,
    padding: 20,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  statNumber: {
    display: "block",
    fontSize: 34,
    color: "#111827",
    fontWeight: 700,
  },
  section: {
    background: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  sectionTitle: { marginTop: 0, marginBottom: 16, fontSize: 24 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { borderBottom: "1px solid #e5e7eb", padding: 10, textAlign: "left" },
  td: { borderBottom: "1px solid #f3f4f6", padding: 10 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  post: { border: "1px solid #e5e7eb", borderRadius: 8, padding: 16 },
  postTitle: { marginTop: 0, color: "#111827" },
  postText: { marginBottom: 12, color: "#4b5563" },
  error: { color: "#b91c1c" },
};

export default AdminDashBoard;
