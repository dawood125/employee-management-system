import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "../common/Modal";
import { employeeService } from "../../services/employeeService";
import {
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineFlag,
  HiOutlineCalendar,
} from "react-icons/hi";

const TaskFormModal = ({ isOpen, onClose, onSubmit, task, loading }) => {
  const isEdit = !!task;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
    status: "todo",
  });

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        assignedTo: task.assignedTo?._id || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        status: task.status || "todo",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
        status: "todo",
      });
    }
  }, [task]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Task" : "Create New Task"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Task Title
          </label>
          <div className="relative">
            <HiOutlineClipboardList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field pl-12"
              placeholder="Enter task title"
              required
            />
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <div className="relative">
            <HiOutlineDocumentText className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field pl-12 min-h-[100px] resize-none"
              placeholder="Enter task description"
              rows={3}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Assign To */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Assign To
            </label>
            <div className="relative">
              <HiOutlineUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="input-field pl-12 appearance-none cursor-pointer"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.user?.name} - {emp.position}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Priority */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <div className="relative">
              <HiOutlineFlag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input-field pl-12 appearance-none cursor-pointer"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </motion.div>

          {/* Due Date */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Due Date
            </label>
            <div className="relative">
              <HiOutlineCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={today}
                className="input-field pl-12"
                required
              />
            </div>
          </motion.div>

          {/* Status (only for edit) */}
          {isEdit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field appearance-none cursor-pointer"
              >
                <option value="todo">📋 To Do</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </motion.div>
          )}
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 pt-4"
        >
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isEdit ? (
              "Update Task"
            ) : (
              "Create Task"
            )}
          </button>
        </motion.div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
