import Task from "../models/Task.js";
import Employee from "../models/Employee.js";

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Filter by assigned employee
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    // If user is employee, show only their tasks
    if (req.user.role === "employee") {
      const employee = await Employee.findOne({ user: req.user._id });
      if (employee) {
        query.assignedTo = employee._id;
      }
    }

    const tasks = await Task.find(query)
      .populate({
        path: "assignedTo",
        select: "employeeId position",
        populate: {
          path: "user",
          select: "name email"
        }
      })
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate({
        path: "assignedTo",
        select: "employeeId position",
        populate: {
          path: "user",
          select: "name email"
        }
      })
      .populate("assignedBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private/Admin/Manager
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    // Check if employee exists
    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      priority,
      dueDate
    });

    const populatedTask = await Task.findById(task._id)
      .populate({
        path: "assignedTo",
        select: "employeeId position",
        populate: {
          path: "user",
          select: "name email"
        }
      })
      .populate("assignedBy", "name email");

    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private/Admin/Manager
export const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate({
        path: "assignedTo",
        select: "employeeId position",
        populate: {
          path: "user",
          select: "name email"
        }
      })
      .populate("assignedBy", "name email");

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Update task status only
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // If employee, check if task belongs to them
    if (req.user.role === "employee") {
      const employee = await Employee.findOne({ user: req.user._id });
      if (!employee || task.assignedTo.toString() !== employee._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this task"
        });
      }
    }

    // Update status
    task.status = status;

    // Set completedAt if status is completed
    if (status === "completed") {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin/Manager
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Get my tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
export const getMyTasks = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found"
      });
    }

    const tasks = await Task.find({ assignedTo: employee._id })
      .populate("assignedBy", "name email")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Get task stats
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const todo = await Task.countDocuments({ status: "todo" });
    const inProgress = await Task.countDocuments({ status: "in-progress" });
    const completed = await Task.countDocuments({ status: "completed" });

    // Overdue tasks
    const overdue = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" }
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        todo,
        inProgress,
        completed,
        overdue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};