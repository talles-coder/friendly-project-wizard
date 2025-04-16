
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  requiredRole?: "admin" | "afiliado" | undefined;
}

const Layout = ({ requiredRole }: LayoutProps) => {
  const { user, isAuthenticated } = useAuth();

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, redirect to dashboard
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/cupons" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
