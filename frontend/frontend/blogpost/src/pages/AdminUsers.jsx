import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Api/Api.js";

const emptyForm = { userName: "", email: "", password: "", role: "user" };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    const res = await Api.get("/api/users/all");
    setUsers(res.data);
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await Api.get("/api/users/all");
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users");
      }
    };

    loadUsers();
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
        await Api.put(`/api/users/${editingId}`, {
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          roles: formData.role,
        });
        setMessage("User updated.");
      } else {
        await Api.post("/api/auth/register", formData);
        setMessage("User created.");
      }

      resetForm();
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "User save failed");
    }
  };

  const editUser = (item) => {
    setEditingId(item._id || item.id);
    setFormData({
      userName: item.userName,
      email: item.email,
      password: "",
      role: item.roles,
    });
  };

  const deleteUser = async (id) => {
    setError("");
    setMessage("");

    try {
      await Api.delete(`/api/users/${id}`);
      setMessage("User deleted.");
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/posts">Posts</Link>
        <Link to="/">Home</Link>
      </nav>

      <section style={styles.panel}>
        <h1 style={styles.heading}>Users</h1>
        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="userName" placeholder="Username" value={formData.userName} onChange={handleChange} required style={styles.input} />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />
          <input name="password" type="password" placeholder={editingId ? "New password optional" : "Password"} value={formData.password} onChange={handleChange} required={!editingId} style={styles.input} />
          <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" style={styles.primaryButton}>{editingId ? "Update User" : "Create User"}</button>
          {editingId && <button type="button" onClick={resetForm} style={styles.secondaryButton}>Cancel</button>}
        </form>
      </section>

      <section style={styles.panel}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item._id || item.id}>
                  <td style={styles.td}>{item.userName}</td>
                  <td style={styles.td}>{item.email}</td>
                  <td style={styles.td}>{item.roles}</td>
                  <td style={styles.td}>
                    <button onClick={() => editUser(item)} style={styles.smallButton}>Edit</button>
                    <button onClick={() => deleteUser(item._id || item.id)} style={styles.dangerButton}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

const styles = {
  page: { minHeight: "100vh", background: "#f5f7fb", padding: 24, boxSizing: "border-box", textAlign: "left" },
  nav: { display: "flex", gap: 16, marginBottom: 24 },
  panel: { background: "#fff", borderRadius: 8, padding: 20, marginBottom: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
  heading: { marginTop: 0 },
  form: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 },
  input: { padding: 10, border: "1px solid #d1d5db", borderRadius: 6 },
  primaryButton: { padding: 10, border: "none", borderRadius: 6, background: "#2563eb", color: "#fff", cursor: "pointer" },
  secondaryButton: { padding: 10, border: "1px solid #d1d5db", borderRadius: 6, background: "#fff", cursor: "pointer" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { borderBottom: "1px solid #e5e7eb", padding: 10, textAlign: "left" },
  td: { borderBottom: "1px solid #f3f4f6", padding: 10 },
  smallButton: { marginRight: 8, padding: "6px 10px", border: "none", borderRadius: 6, background: "#e0f2fe", cursor: "pointer" },
  dangerButton: { padding: "6px 10px", border: "none", borderRadius: 6, background: "#fee2e2", color: "#991b1b", cursor: "pointer" },
  error: { color: "#b91c1c" },
  success: { color: "#047857" },
};

export default AdminUsers;
