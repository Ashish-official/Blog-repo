import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Api/Api.js";
import { AuthContext } from "../context/AuthContext.js";
import AdSlot from "../components/AdSlot.jsx";

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await Api.get("/api/posts");
        setPosts(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load blog posts");
      }
    };

    fetchPosts();
  }, []);

  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.brand}>Blog</Link>
        <div style={styles.links}>
          {user ? (
            <>
              <Link to="/create-blog">Create Blog</Link>
              {user.roles === "admin" && <Link to="/admin">Admin</Link>}
              <button onClick={logout} style={styles.linkButton}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>

      <section style={styles.header}>
        <h1 style={styles.heading}>Latest Blog Posts</h1>
        <p style={styles.subheading}>
          {user ? `Welcome, ${user.userName}` : "Login to create a new post."}
        </p>
      </section>

      <AdSlot id="home-top-banner" sizes={[[728, 90], [320, 50]]} style={styles.bannerAd} />

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.contentLayout}>
        <section style={styles.grid}>
          {posts.length === 0 && !error ? (
            <p style={styles.empty}>No blog posts yet.</p>
          ) : (
            posts.map((post, index) => (
              <div key={post._id}>
                <article style={styles.card}>
                  <h2 style={styles.cardTitle}>
                    <Link to={`/posts/${post._id}`} style={styles.cardLink}>{post.title}</Link>
                  </h2>
                  <p style={styles.cardText}>{post.description}</p>
                  <small>
                    By {post.author?.userName || "Unknown"} on{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </small>
                </article>
                {index === 0 && (
                  <AdSlot id="home-in-content-one" sizes={[[300, 250]]} style={styles.inlineAd} />
                )}
                {index === 2 && (
                  <AdSlot id="home-in-content-two" sizes={[[300, 250]]} style={styles.inlineAd} />
                )}
              </div>
            ))
          )}
        </section>
        <aside style={styles.sidebar}>
          <AdSlot id="home-sidebar-ad" sizes={[[300, 250]]} />
        </aside>
      </div>

      <AdSlot id="home-bottom-banner" sizes={[[728, 90], [320, 50]]} style={styles.bannerAd} />
      <AdSlot id="home-sticky-footer" sizes={[[728, 90], [320, 50]]} style={styles.stickyAd} />
    </main>
  );
};

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
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    background: "#fff",
    borderRadius: 8,
    padding: 16,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  brand: { fontWeight: 700, fontSize: 24, textDecoration: "none", color: "#111827" },
  links: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    padding: 0,
    font: "inherit",
  },
  header: { textAlign: "center", padding: "48px 0 32px" },
  heading: { margin: 0, fontSize: 40 },
  subheading: { marginTop: 8, color: "#4b5563" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    flex: 1,
  },
  contentLayout: { display: "flex", gap: 16, alignItems: "flex-start" },
  sidebar: { width: 320, position: "sticky", top: 16 },
  card: {
    background: "#fff",
    borderRadius: 8,
    padding: 20,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  cardTitle: { marginTop: 0, marginBottom: 10, fontSize: 24 },
  cardLink: { color: "#111827", textDecoration: "none" },
  cardText: { color: "#4b5563", marginBottom: 16 },
  empty: { textAlign: "center", gridColumn: "1 / -1" },
  error: { color: "#b91c1c", textAlign: "center" },
  bannerAd: { margin: "0 auto 24px", maxWidth: 760 },
  inlineAd: { marginTop: 16 },
  stickyAd: {
    position: "sticky",
    bottom: 0,
    maxWidth: 760,
    margin: "24px auto 0",
    zIndex: 10,
  },
};

export default HomePage;
