
import { useAuth } from "@/contexts/AuthContext";
import { Package, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/cupons"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Package className="h-5 w-5" />
              <span>Cupons</span>
            </NavLink>
          </li>
          
          {isAdmin && (
            <li>
              <NavLink
                to="/usuarios"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Users className="h-5 w-5" />
                <span>Usuários</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
