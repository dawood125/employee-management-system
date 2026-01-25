import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineOfficeBuilding,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCog,
} from "react-icons/hi";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Menu items based on role
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: HiOutlineViewGrid,
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Employees",
      path: "/employees",
      icon: HiOutlineUsers,
      roles: ["admin", "manager"],
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: HiOutlineClipboardList,
      roles: ["admin", "manager", "employee"],
    },
    {
      name: "Departments",
      path: "/departments",
      icon: HiOutlineOfficeBuilding,
      roles: ["admin"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  const getRoleBadge = (role) => {
    const badges = {
      admin: "badge-admin",
      manager: "badge-manager",
      employee: "badge-employee",
    };
    return badges[role] || "badge-employee";
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-screen w-64 bg-dark-200/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-50"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold gradient-text"
        >
          EMS
        </motion.h1>
        <p className="text-gray-500 text-sm mt-1">Management System</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate">{user?.name}</p>
            <span className={`badge ${getRoleBadge(user?.role)}`}>
              {user?.role}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenu.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="sidebarlinks-name">{item.name}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
          }
        >
          <HiOutlineUser className="w-5 h-5" />
          <span className="sidebarlinks-name">Profile</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <HiOutlineLogout className="w-5 h-5" />
          <span className="sidebarlinks-name">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
