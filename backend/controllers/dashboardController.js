import Employee from "../models/Employee.js";
import Task from "../models/Task.js";
import Department from "../models/Department.js";

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: "active" });
    const totalDepartments = await Department.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const pendingTasks = await Task.countDocuments({
      status: { $in: ["todo", "in-progress"] },
    });

    // Recent employees
    const recentEmployees = await Employee.find()
      .populate("user", "name email")
      .populate("department", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent tasks
    const recentTasks = await Task.find()
      .populate({
        path: "assignedTo",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalEmployees,
          activeEmployees,
          totalDepartments,
          totalTasks,
          completedTasks,
          pendingTasks,
        },
        recentEmployees,
        recentTasks,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
