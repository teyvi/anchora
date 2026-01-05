 import {  Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/admin/adminDashboard";
import AdminUsers from "@/pages/admin/adminUsers";
import AdminPosts from "@/pages/admin/adminPosts";
import UserDashboard from "@/pages/user/userDashboard";
import UserPosts from "@/pages/user/userPosts";
import CreatePost from "@/pages/user/createPost";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/context/authContext";


// Protected route wrapper
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (!requireAdmin && isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/posts" element={<ProtectedRoute requireAdmin><AdminPosts /></ProtectedRoute>} />
      
      {/* User Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/posts" element={<ProtectedRoute><UserPosts /></ProtectedRoute>} />
      <Route path="/dashboard/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};



export default AppRoutes;
