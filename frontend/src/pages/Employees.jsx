import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../components/common/Layout";
import EmployeeCard from "../components/employees/EmployeeCard";
import EmployeeFormModal from "../components/employees/EmployeeFormModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { employeeService } from "../services/employeeService";
import { departmentService } from "../services/departmentService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineUsers,
} from "react-icons/hi";

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const canEdit = ["admin", "manager"].includes(user?.role);
  const canDelete = user?.role === "admin";
  const canAdd = user?.role === "admin";

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [filterDepartment, filterStatus]);

  const fetchEmployees = async () => {
    try {
      const filters = {};
      if (filterDepartment) filters.department = filterDepartment;
      if (filterStatus) filters.status = filterStatus;

      const response = await employeeService.getAll(filters);
      setEmployees(response.data);
    } catch (error) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAll();
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowFormModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowFormModal(true);
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedEmployee) {
        // Update
        await employeeService.update(selectedEmployee._id, formData);
        toast.success("Employee updated successfully!");
      } else {
        // Create
        await employeeService.create(formData);
        toast.success("Employee added successfully!");
      }
      setShowFormModal(false);
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await employeeService.delete(selectedEmployee._id);
      toast.success("Employee deleted successfully!");
      setShowDeleteModal(false);
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter employees by search
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.position?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-1">Employees</h1>
          <p className="text-gray-400">Manage your team members</p>
        </motion.div>

        {canAdd && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddEmployee}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add Employee
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
              placeholder="Search employees..."
              className="input-field pl-12"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <HiOutlineFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="input-field pl-12 pr-8 appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </motion.div>

      {/* Employee Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 mb-6 text-gray-400"
      >
        <HiOutlineUsers className="w-5 h-5" />
        <span>{filteredEmployees.length} employees found</span>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-64 rounded-2xl" />
          ))}
        </div>
      ) : filteredEmployees.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <HiOutlineUsers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No employees found
          </h3>
          <p className="text-gray-400 mb-6">
            {search || filterDepartment || filterStatus
              ? "Try adjusting your filters"
              : "Get started by adding your first employee"}
          </p>
          {canAdd && !search && !filterDepartment && !filterStatus && (
            <button onClick={handleAddEmployee} className="btn-primary">
              <HiOutlinePlus className="w-5 h-5 inline mr-2" />
              Add Employee
            </button>
          )}
        </motion.div>
      ) : (
        /* Employee Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee, index) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              index={index}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteClick}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <EmployeeFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        employee={selectedEmployee}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee?.user?.name}? This action cannot be undone.`}
        loading={actionLoading}
      />
    </Layout>
  );
};

export default Employees;
