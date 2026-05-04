import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Api from "../Api/Api.js";
import AdSlot from "../components/AdSlot.jsx";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await Api.get(`/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <p style={{ padding: 24 }}>Loading post...</p>;
  }

  return (
    <main style={styles.page}>
      <Link to="/">Back to home</Link>
      <AdSlot id="post-detail-top-banner" sizes={[[728, 90], [320, 50]]} style={styles.topAd} />
      {error && <p style={styles.error}>{error}</p>}
      {post && (
        <article style={styles.article}>
          <h1 style={styles.title}>{post.title}</h1>
          <p style={styles.meta}>
            By {post.author?.userName || "Unknown"} on{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p style={styles.body}>{post.description}</p>
          <AdSlot id="post-detail-in-content" sizes={[[300, 250]]} style={styles.inlineAd} />
        </article>
      )}
      <AdSlot id="post-detail-bottom-banner" sizes={[[728, 90], [320, 50]]} style={styles.topAd} />
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
  article: {
    maxWidth: 760,
    margin: "24px auto",
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  title: { fontSize: 40, marginTop: 0 },
  meta: { color: "#6b7280", marginBottom: 24 },
  body: { color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" },
  topAd: { maxWidth: 760, margin: "20px auto" },
  inlineAd: { margin: "24px 0" },
  error: { color: "#b91c1c", textAlign: "center" },
};

export default PostDetail;
