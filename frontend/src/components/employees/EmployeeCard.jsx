import { motion } from "framer-motion";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";

const EmployeeCard = ({
  employee,
  onEdit,
  onDelete,
  index,
  canEdit,
  canDelete,
}) => {
  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-gradient-to-r from-amber-500 to-orange-500",
      manager: "bg-gradient-to-r from-blue-500 to-cyan-500",
      employee: "bg-gradient-to-r from-emerald-500 to-teal-500",
    };
    return badges[role] || badges.employee;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="card card-hover group"
    >
      <div className="flex items-start justify-between mb-4">
        {/* Avatar & Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/30">
            {employee.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">
              {employee.user?.name}
            </h3>
            <p className="text-gray-400 text-sm">{employee.position}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}
        >
          {employee.status}
        </span>
      </div>

      {/* Employee ID & Role */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-500 text-sm">{employee.employeeId}</span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getRoleBadge(employee.user?.role)}`}
        >
          {employee.user?.role}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <HiOutlineMail className="w-4 h-4" />
          <span className="truncate">{employee.user?.email}</span>
        </div>
        {employee.phone && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <HiOutlinePhone className="w-4 h-4" />
            <span>{employee.phone}</span>
          </div>
        )}
      </div>

      {/* Department */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div>
          <p className="text-gray-500 text-xs">Department</p>
          <p className="text-white font-medium">{employee.department?.name}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {canEdit && (
            <button
              onClick={() => onEdit(employee)}
              className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all duration-300"
            >
              <HiOutlinePencil className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(employee)}
              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeCard;
