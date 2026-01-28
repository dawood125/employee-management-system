import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "../common/Modal";
import { HiOutlineOfficeBuilding, HiOutlineDocumentText } from "react-icons/hi";

const DepartmentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  department,
  loading,
}) => {
  const isEdit = !!department;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        description: department.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [department]);

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Department" : "Add New Department"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Department Name
          </label>
          <div className="relative">
            <HiOutlineOfficeBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field pl-12"
              placeholder="e.g. Engineering"
              required
            />
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
              placeholder="Department description..."
              rows={3}
            />
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
              "Update"
            ) : (
              "Create"
            )}
          </button>
        </motion.div>
      </form>
    </Modal>
  );
};

export default DepartmentFormModal;
