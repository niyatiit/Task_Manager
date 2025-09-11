import { Task } from "../module/Task.Module.js";
import excelJS from "exceljs";
import { User } from "../module/User.Module.js";

const exportTaskReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assigneTo", "username email");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Task Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "description", key: "description", width: 50 },
      { header: "priority", key: "priority", width: 15 },
      { header: "Status", key: "Status", width: 20 },
      { header: "Due Date", key: "Due Date", width: 20 },
      { header: "Assigne To", key: "Assigne To", width: 30 },
    ];

    tasks.forEach((task) => {
      const assigneTo = task.assigneTo
        .map((user) => `${user.username} (${user.email})`)
        .join(", ");
      worksheet.addRow({
        _id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assigneTo: task.assigneTo || "Unassigned",
      });
    });

    res.setHeader(
      "Content-Type", // browser it's an excel file
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // downloaded the file with given name.
    );

    res.setHeader("Content-Type", 'attachment; filename="tasks_report.xlsx"');
    return workbook.xlsx.write(res).then(() => res.end()); //Excel content to the response
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
const exportUserReport = async (req, res) => {
  try {
    const users = await User.find().select("username email_id").lean();
    const userTasks = await Task.find().populate(
      "AssigneTo",
      "username email_id"
    );
    const userTaskMap = {};

    users.forEach((user) => {
      userTaskMap[user._id] = {
        username: user.username,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.addigneTo) {
        task.assigneTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            taskCount += 1;
            if (task.status === "Pending") {
              userTaskMap[assignedUser._id].pendingTask += 1;
            } else if (task.status === "In Progress") {
              userTaskMap[assignedUser._id].inProgressTasks += 1;
            }
            else if(task.status === "Completed"){
                userTaskMap[assignedUser._id].completedTasks += 1;
            }
          }
        });
      }
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");

    worksheet.columns = [
        {header : "User Name" , key : "username" , width : 30 },
        {header : "Email" , key : "email" , width : 40 },
        {header : "Total Assigned Task" , key : "taskCount" , width : 20 },
        {header : "Pending Task" , key : "pendingTasks" , width : 20 },
        {header : "In Progress Task" , key : "inProgressTasks" , width : 20 },
        {header : "Complete Task" , key : "completedTasks" , width : 20 },
    ]

    Object.values(userTaskMap).forEach((user) => {
        worksheet.addRow(user);
    })

     res.setHeader(
      "Content-Type", // browser it's an excel file
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // downloaded the file with given name.
    );

    res.setHeader("Content-Type", 'attachment; filename="tasks_report.xlsx"');

    return workbook.xlsx.write(res).then(() => {
        res.end()
    })
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export { exportTaskReport, exportUserReport };
