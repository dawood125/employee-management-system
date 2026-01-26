import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "../common/Modal";
import { departmentService } from "../../services/departmentService";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";

const EmployeeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  employee,
  loading,
}) => {
  const isEdit = !!employee;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    position: "",
    salary: "",
    status: "active",
    role: "employee",
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.user?.name || "",
        email: employee.user?.email || "",
        password: "",
        phone: employee.phone || "",
        department: employee.department?._id || "",
        position: employee.position || "",
        salary: employee.salary || "",
        status: employee.status || "active",
        role: employee.user?.role || "employee",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        department: "",
        position: "",
        salary: "",
        status: "active",
        role: "employee",
      });
    }
  }, [employee]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAll();
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
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

  const inputFields = [
    {
      name: "name",
      type: "text",
      label: "Full Name",
      icon: HiOutlineUser,
      placeholder: "John Doe",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      icon: HiOutlineMail,
      placeholder: "john@company.com",
      required: true,
    },
    {
      name: "password",
      type: "password",
      label: isEdit ? "Password (leave empty to keep)" : "Password",
      icon: HiOutlineLockClosed,
      placeholder: "••••••",
      required: !isEdit,
    },
    {
      name: "phone",
      type: "text",
      label: "Phone",
      icon: HiOutlinePhone,
      placeholder: "123-456-7890",
      required: false,
    },
    {
      name: "position",
      type: "text",
      label: "Position",
      icon: HiOutlineBriefcase,
      placeholder: "Software Developer",
      required: true,
    },
    {
      name: "salary",
      type: "number",
      label: "Salary",
      icon: HiOutlineCurrencyDollar,
      placeholder: "50000",
      required: false,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Employee" : "Add New Employee"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {inputFields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label}
              </label>
              <div className="relative">
                <field.icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder={field.placeholder}
                  required={field.required}
                />
              </div>
            </motion.div>
          ))}

          {/* Department Select */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Department
            </label>
            <div className="relative">
              <HiOutlineOfficeBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field pl-12 appearance-none cursor-pointer"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Role Select */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field appearance-none cursor-pointer"
              required
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </motion.div>

          {/* Status Select (only for edit) */}
          {isEdit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </motion.div>
          )}
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
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
              "Update Employee"
            ) : (
              "Add Employee"
            )}
          </button>
        </motion.div>
      </form>
    </Modal>
  );
};

export default EmployeeFormModal;
