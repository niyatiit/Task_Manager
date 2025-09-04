import { Task } from "../module/Task.Module.js";
import { User } from "../module/User.Module.js";

const getUser = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    // Add task count each other
    const userWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTask = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completeTask = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });
        return {
          ...user._doc,
          pendingTasks,
          inProgressTask,
          completeTask,
        };
      })
    );
    return res.json({
      success: true,
      message: "Members fetched successfully",
      users: userWithTaskCounts,
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found please try again ",
      });
    }
    return res.json({
      user
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if(!user){
        return res.json({success : false , message : "User not found"})
    }

    await User.findByIdAndDelete(req.params.id)

    return res.json({success : true , message : "User Removed Successfully "})

  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export { getUser, getUserById, deleteUser };
