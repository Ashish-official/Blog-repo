import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import AdminDashBoard from "./pages/AdminDashBoard.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminPosts from "./pages/AdminPosts.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import { AuthContext } from "./context/AuthContext.js";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p style={{ padding: 24 }}>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.roles !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute adminOnly>
              <AdminPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-blog"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
