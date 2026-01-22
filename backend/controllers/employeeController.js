import Employee from "../models/Employee.js";
import User from "../models/User.js";

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
export const getEmployees = async (req, res) => {
  try {
    let query = {};

    // Filter by department
    if (req.query.department) {
      query.department = req.query.department;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const employees = await Employee.find(query)
      .populate("user", "name email avatar role")
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("user", "name email avatar role")
      .populate("department", "name");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, role, phone, department, position, salary } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user first
    const user = await User.create({
      name,
      email,
      password,
      role: role || "employee",
    });

    // Create employee
    const employee = await Employee.create({
      user: user._id,
      phone,
      department,
      position,
      salary,
    });

    // Get employee with populated data
    const populatedEmployee = await Employee.findById(employee._id)
      .populate("user", "name email role")
      .populate("department", "name");

    res.status(201).json({
      success: true,
      data: populatedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Update user name/email if provided
    if (req.body.name || req.body.email) {
      await User.findByIdAndUpdate(employee.user, {
        name: req.body.name,
        email: req.body.email,
      });
    }

    // Update employee
    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        phone: req.body.phone,
        department: req.body.department,
        position: req.body.position,
        salary: req.body.salary,
        status: req.body.status,
      },
      { new: true, runValidators: true },
    )
      .populate("user", "name email role")
      .populate("department", "name");

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Delete user too
    await User.findByIdAndDelete(employee.user);
    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get employee stats
// @route   GET /api/employees/stats
// @access  Private
export const getEmployeeStats = async (req, res) => {
  try {
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: "active" });
    const inactive = await Employee.countDocuments({ status: "inactive" });

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
