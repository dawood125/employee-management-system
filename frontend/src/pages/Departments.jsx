import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../components/common/Layout";
import DepartmentFormModal from "../components/departments/DepartmentFormModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { departmentService } from "../services/departmentService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  HiOutlinePlus,
  HiOutlineOfficeBuilding,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineUsers,
} from "react-icons/hi";

const Departments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const canManage = user?.role === "admin";

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAll();
      setDepartments(response.data);
    } catch (error) {
      toast.error("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedDepartment(null);
    setShowFormModal(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setShowFormModal(true);
  };

  const handleDeleteClick = (department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedDepartment) {
        await departmentService.update(selectedDepartment._id, formData);
        toast.success("Department updated successfully!");
      } else {
        await departmentService.create(formData);
        toast.success("Department created successfully!");
      }
      setShowFormModal(false);
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await departmentService.delete(selectedDepartment._id);
      toast.success("Department deleted successfully!");
      setShowDeleteModal(false);
      fetchDepartments();
    } catch (error) {
      toast.error("Failed to delete department");
    } finally {
      setActionLoading(false);
    }
  };

  const colors = [
    "from-indigo-600 to-purple-600",
    "from-emerald-600 to-teal-600",
    "from-amber-600 to-orange-600",
    "from-rose-600 to-pink-600",
    "from-cyan-600 to-blue-600",
    "from-violet-600 to-purple-600",
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-1">Departments</h1>
          <p className="text-gray-400">Organize your company structure</p>
        </motion.div>

        {canManage && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add Department
          </motion.button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-48 rounded-2xl" />
          ))}
        </div>
      ) : departments.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <HiOutlineOfficeBuilding className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No departments yet
          </h3>
          <p className="text-gray-400 mb-6">
            Create departments to organize your employees
          </p>
          {canManage && (
            <button onClick={handleAdd} className="btn-primary">
              <HiOutlinePlus className="w-5 h-5 inline mr-2" />
              Add Department
            </button>
          )}
        </motion.div>
      ) : (
        /* Department Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department, index) => (
            <motion.div
              key={department._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card card-hover group"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center mb-4 shadow-lg`}
              >
                <HiOutlineOfficeBuilding className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-2">
                {department.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {department.description || "No description provided"}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-gray-400">
                  <HiOutlineUsers className="w-4 h-4" />
                  <span className="text-sm">
                    {department.employeeCount || 0} employees
                  </span>
                </div>

                {/* Actions */}
                {canManage && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEdit(department)}
                      className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all duration-300"
                    >
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(department)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <DepartmentFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        department={selectedDepartment}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        message={`Are you sure you want to delete "${selectedDepartment?.name}"? This action cannot be undone.`}
        loading={actionLoading}
      />
    </Layout>
  );
};

export default Departments;
