import Department from "../models/Department.js";

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Private
export const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if department exists
    const existingDept = await Department.findOne({ name });
    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: "Department already exists"
      });
    }

    const department = await Department.create({
      name,
      description
    });

    res.status(201).json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    await department.deleteOne();

    res.status(200).json({
      success: true,
      message: "Department deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};