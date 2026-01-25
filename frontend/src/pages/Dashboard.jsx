import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dashboardService";
import Layout from "../components/common/Layout";
import StatsCard from "../components/dashboard/StatsCard";
import {
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineOfficeBuilding,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamation,
} from "react-icons/hi";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data.stats);
      setRecentEmployees(response.data.recentEmployees);
      setRecentTasks(response.data.recentTasks);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees || 0,
      icon: HiOutlineUsers,
      color: "indigo",
    },
    {
      title: "Active Employees",
      value: stats?.activeEmployees || 0,
      icon: HiOutlineCheckCircle,
      color: "emerald",
    },
    {
      title: "Departments",
      value: stats?.totalDepartments || 0,
      icon: HiOutlineOfficeBuilding,
      color: "purple",
    },
    {
      title: "Total Tasks",
      value: stats?.totalTasks || 0,
      icon: HiOutlineClipboardList,
      color: "cyan",
    },
    {
      title: "Completed Tasks",
      value: stats?.completedTasks || 0,
      icon: HiOutlineCheckCircle,
      color: "emerald",
    },
    {
      title: "Pending Tasks",
      value: stats?.pendingTasks || 0,
      icon: HiOutlineClock,
      color: "amber",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      todo: "bg-amber-500/20 text-amber-400",
      "in-progress": "bg-blue-500/20 text-blue-400",
      completed: "bg-emerald-500/20 text-emerald-400",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-500/20 text-red-400",
      medium: "bg-amber-500/20 text-amber-400",
      low: "bg-emerald-500/20 text-emerald-400",
    };
    return colors[priority] || "bg-gray-500/20 text-gray-400";
  };

  // Loading Skeleton
  if (loading) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="skeleton h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="gradient-text">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your organization today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Recent Employees
            </h2>
            <span className="text-sm text-gray-400">
              {recentEmployees.length} new
            </span>
          </div>

          <div className="space-y-4">
            {recentEmployees.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No employees yet</p>
            ) : (
              recentEmployees.slice(0, 5).map((employee, index) => (
                <motion.div
                  key={employee._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {employee.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {employee.user?.name}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {employee.position}
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {employee.department?.name}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
            <span className="text-sm text-gray-400">
              {recentTasks.length} tasks
            </span>
          </div>

          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks yet</p>
            ) : (
              recentTasks.slice(0, 5).map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getPriorityColor(task.priority)}`}
                  >
                    <HiOutlineClipboardList className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {task.title}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {task.assignedTo?.user?.name || "Unassigned"}
                    </p>
                  </div>
                  <span className={`badge ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
