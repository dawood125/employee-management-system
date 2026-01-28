import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../components/common/Layout";
import TaskCard from "../components/tasks/TaskCard";
import TaskFormModal from "../components/tasks/TaskFormModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { taskService } from "../services/taskService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineClipboardList,
  HiOutlineFilter,
} from "react-icons/hi";

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const canEdit = ["admin", "manager"].includes(user?.role);
  const canDelete = ["admin", "manager"].includes(user?.role);
  const canAdd = ["admin", "manager"].includes(user?.role);

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterPriority]);

  const fetchTasks = async () => {
    try {
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterPriority) filters.priority = filterPriority;

      const response = await taskService.getAll(filters);
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowFormModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowFormModal(true);
  };

  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateStatus(taskId, newStatus);
      toast.success("Status updated!");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedTask) {
        await taskService.update(selectedTask._id, formData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(formData);
        toast.success("Task created successfully!");
      }
      setShowFormModal(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await taskService.delete(selectedTask._id);
      toast.success("Task deleted successfully!");
      setShowDeleteModal(false);
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter tasks by search
  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase()) ||
      task.assignedTo?.user?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  // Group tasks by status
  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const inProgressTasks = filteredTasks.filter(
    (t) => t.status === "in-progress",
  );
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-1">Tasks</h1>
          <p className="text-gray-400">Manage and track your team's tasks</p>
        </motion.div>

        {canAdd && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddTask}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Create Task
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="input-field pl-12"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="input-field appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4 mb-6"
      >
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-gray-400">{todoTasks.length}</p>
          <p className="text-gray-500 text-sm">To Do</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-blue-400">
            {inProgressTasks.length}
          </p>
          <p className="text-gray-500 text-sm">In Progress</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-emerald-400">
            {completedTasks.length}
          </p>
          <p className="text-gray-500 text-sm">Completed</p>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-72 rounded-2xl" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <HiOutlineClipboardList className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No tasks found
          </h3>
          <p className="text-gray-400 mb-6">
            {search || filterStatus || filterPriority
              ? "Try adjusting your filters"
              : "Get started by creating your first task"}
          </p>
          {canAdd && !search && !filterStatus && !filterPriority && (
            <button onClick={handleAddTask} className="btn-primary">
              <HiOutlinePlus className="w-5 h-5 inline mr-2" />
              Create Task
            </button>
          )}
        </motion.div>
      ) : (
        /* Task Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task, index) => (
            <TaskCard
              key={task._id}
              task={task}
              index={index}
              onEdit={handleEditTask}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <TaskFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        task={selectedTask}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
        loading={actionLoading}
      />
    </Layout>
  );
};

export default Tasks;
