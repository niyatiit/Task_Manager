const BASE_URL = "http://localhost:3000";

// Utils/apiPath.js

const API_PATHS = () => {
  AUTH: {
    REGISTER: "api/auth/register";
    LOGIN: "api/auth/login";
    GET_PROFILE: "api/auth/profile";
  }

  USERS: {
    GET_ALL_USERS: "/api/user";
    GET_USERS_BY_ID: (userId) => `/api/users/${userId}`;
    CREATE_USER: "/api/user";
    UPDATE_USER: (userId) => `/api/user/${userId}`;
    DELETE_USER: (userId) => `/api/user/${userId}`;
  }

  TASKS: {
    GET_DASHBOARD_DATA: "/api/task/dashboard-data";
    GET_USER_DASHBOARD_DATA: "/api/task/user-dashboard-data";
    GET_ALL_TASKS: "/api/task/";
    GET_TASK_BY_ID: (taskId) => `/api/task/${taskId}`;
    CREATE_TASK: "/api/task/";
    UPDATE_TASK: (taskId) => `/api/task/${taskId}`;
    DELETE_TASK: (taskId) => `/api/task/${taskId}`;
    UPDATE_TASK_STATUS: (taskId) =>`/api/task/${taskId}status`;
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/task/${taskId}/todo` ;
  }

  REPORTS : {
    EXPORT_TASKS : "/api/report/export/tasks"
    EXPORT_USERS : "/api/report/export/users"
  }

  IMAGE : {
    UPLOAD_IMAGE : "/api/auth/upload-image"
  }
};
