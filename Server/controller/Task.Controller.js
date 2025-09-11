import { Task } from "../module/Task.Module.js";

// Dashboard show
const getDashboardData = async (req, res) => {
  try {
    const totalTask = await Task.countDocuments();
    const pendingTask = await Task.countDocuments({ status: "Pending" });
    const completedTask = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" }, //not equal to completed
      dueDate: { $lt: new Date() }, //past dead line
    });

    // Ensure all posible statuses are included
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributoinRow = await Task.aggregate([
      {
        $group: {
          _id: "$status", //id of the task which is tastStatueses
          count: { $sum: 1 }, //count total task like pending = 4 , completed = 3 like this type
        },
      },
    ]);

    const taskDistributoin = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); //remove the space for response key
      acc[formattedKey] =
        taskDistributoinRow.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistributoin["All"] = totalTask; //Add total count to taskDistribution

    // Ensure all proriti levels are includes
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch recent 10 tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 }) // descending order (newest first)
      .limit(10)
      .select("title status priority createdAt");

    return res.json({
      success: true,
      message: "Get the dashboard data ",
      statistics: {
        totalTask,
        pendingTask,
        completedTask,
        overdueTasks,
      },
      charts: {
        taskDistributoin,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// User Dashboard
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTask = await Task.countDocuments({ assigneTo: userId });
    const pendingTask = await Task.countDocuments({
      assigneTo: userId,
      status: "Pending",
    });
    const completedTask = await Task.countDocuments({
      assigneTo: userId,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      assigneTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // Task Distribution by status
    const taskStatus = ["Pending", "In Progress", "Completed"];
    const taskDistributoinRow = await Task.aggregate([
      {
        $match: { assigneTo: userId },
      },
      {
        $group: { _id: "$status", count: { $sum: 1 } },
      },
    ]);

    const taskDistribution = taskStatus.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributoinRow.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    taskDistribution["All"] = totalTask;

    // Task Distribution Priority
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assigneTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // fetch recent 10 task form the logged-in user
    const recentTasks = await Task.find({ assigneTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdaAt");

    return res.json({
      success: true,
      message: "User Profile getting the successfully",
      statistics: {
        totalTask,
        pendingTask,
        completedTask,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Get all task with priority
const getTask = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assigneTo",
        "username email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assigneTo: req.user._id }).populate(
        "assigneTo",
        "username email profileImageUrl"
      );
    }

    // Add the completed todochecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoCheckList.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedCount: completedCount };
      })
    );

    const allTask = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assigneTo: req.user._id }
    );

    const pendingTask = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assigneTo: req.user._id }),
    });

    const inProgressTask = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assigneTo: req.user._id }),
    });

    const completedTask = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assigneTo: req.user._id }),
    });

    return res.json({
      tasks,
      statusSummary: {
        all: allTask,
        pendingTask,
        inProgressTask,
        completedTask,
      },
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Get the rask only one with show particular id
const getTaskId = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assigneTo",
      "username email profileImageUrl"
    );

    if (!task) {
      return res.json({ success: false, message: "Task is not found" });
    }

    return res.json({ success: true, task });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Create the task by admin
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assigneTo,
      attachment,
      todoCheckList,
    } = req.body;

    if (!Array.isArray(assigneTo)) {
      return res.json({
        success: false,
        message: "AssigneTo must be an array of users IDs",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assigneTo,
      createdBy: req.user._id,
      attachment,
      todoCheckList,
    });

    return res.json({
      success: true,
      message: "Task is create successfully",
      task,
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Update the Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.json({ success: false, message: "Task is not Found" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.title || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
    task.attachment = req.body.attachment || task.attachment;

    if (req.body.assigneTo) {
      if (!Array.isArray(req.body.assigneTo)) {
        return res.json({
          success: false,
          message: "Assign must be an array of User Id ",
        });
      }
      task.assigneTo = req.body.assigneTo || task.assigneTo;
    }

    const updateTask = await task.save();

    return res.json(
      { success: true, message: "Task is updated Successfully " },
      updateTask
    );
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Delete the one task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.json({ success: false, message: "Task is not found" });
    }

    await task.deleteOne();
    return res.json({
      success: true,
      message: "Task is deleted successfully ",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Update the task status
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.json({ success: false, message: "Task is not found" });
    }

    // Direct comparison instead of .some()
    const isAssigned =
      task.assigneTo && task.assigneTo.toString() === req.user._id.toString();

    if (!isAssigned && req.user.role !== "admin") {
      return res.json({ success: false, message: "Not Authorized " });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoCheckList.forEach((item) => (item.completed = true)); // lowercase 'c'
      task.progress = 100;
    }

    await task.save();
    return res.json({ success: true, message: "Task updated successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Update the checkbox
const updateTaskCheckbox = async (req, res) => {
  try {
    const { todoCheckList } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.json({ success: false, message: "Task is not Found" });
    }

    if (!task.assigneTo.includes(req.user._id) && req.user.role !== "admin") {
      return res.json({
        success: false,
        message: "Not authorized to update Checklist",
      });
    }

    task.todoCheckList = todoCheckList; //Replace with the update check list

    // Auto Update Progress based on checklist completion
    const completedCount = task.todoCheckList.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoCheckList.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // Autho-marks task as completed if all items are checkd
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress === "In Progress") {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }
    await task.save();

    const updateTask = await Task.findById(req.params.id).populate(
      "assigneTo",
      "username email profileImageUrl"
    );
    return res.json({
      success: true,
      message: "Task checklist updated",
      task: updateTask,
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export {
  getDashboardData,
  getUserDashboardData,
  getTask,
  getTaskId,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskCheckbox,
};
