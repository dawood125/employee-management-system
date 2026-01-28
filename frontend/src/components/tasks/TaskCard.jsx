import { motion } from "framer-motion";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlinePlay,
} from "react-icons/hi";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  index,
  canEdit,
  canDelete,
}) => {
  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-500/20 text-red-400 border-red-500/30",
      medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: "from-gray-600 to-gray-500",
      "in-progress": "from-blue-600 to-cyan-500",
      completed: "from-emerald-600 to-teal-500",
    };
    return colors[status] || colors.todo;
  };

  const getStatusIcon = (status) => {
    const icons = {
      todo: HiOutlineClock,
      "in-progress": HiOutlinePlay,
      completed: HiOutlineCheck,
    };
    return icons[status] || HiOutlineClock;
  };

  const StatusIcon = getStatusIcon(task.status);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  const statusOptions = [
    { value: "todo", label: "To Do", icon: "📋" },
    { value: "in-progress", label: "In Progress", icon: "🔄" },
    { value: "completed", label: "Completed", icon: "✅" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="card card-hover group relative overflow-hidden"
    >
      {/* Status Indicator */}
      <div
        className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getStatusColor(task.status)}`}
      />

      <div className="pl-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
              {task.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {task.description || "No description"}
            </p>
          </div>

          {/* Priority Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)} ml-3`}
          >
            {task.priority}
          </span>
        </div>

        {/* Assigned To */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
            {task.assignedTo?.user?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-white text-sm font-medium">
              {task.assignedTo?.user?.name || "Unassigned"}
            </p>
            <p className="text-gray-500 text-xs">
              {task.assignedTo?.position || ""}
            </p>
          </div>
        </div>

        {/* Due Date */}
        <div
          className={`flex items-center gap-2 text-sm mb-4 ${isOverdue ? "text-red-400" : "text-gray-400"}`}
        >
          <HiOutlineCalendar className="w-4 h-4" />
          <span>
            {formatDate(task.dueDate)}
            {isOverdue && " (Overdue)"}
          </span>
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-2 mb-4">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(task._id, option.value)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 ${
                task.status === option.value
                  ? `bg-gradient-to-r ${getStatusColor(option.value)} text-white`
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {option.icon} {option.label}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getStatusColor(task.status)} flex items-center justify-center`}
            >
              <StatusIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-400 text-sm capitalize">
              {task.status.replace("-", " ")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {canEdit && (
              <button
                onClick={() => onEdit(task)}
                className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all duration-300"
              >
                <HiOutlinePencil className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(task)}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
