import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import PrivateRoute from "./routes/PrivateRoute";
import CreateTask from './pages/admin/CreateTask'
import ManageTask from './pages/admin/ManageTask'
import Dashboard from './pages/admin/Dashboard'
import ManageUser from './pages/admin/ManageUser'
import UserDashboard from "./pages/user/UserDashboard";
import ViewTaskDetails from "./pages/user/ViewTaskDetails";
import MyTask from "./pages/user/MyTask";



const App = () => {
  return (
    <>
    <h1> This is App File </h1>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Routers */}
        <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
          <Route path="/admin/dashboard" element={<Dashboard/>}/>
          <Route path="/admin/create-task" element={<CreateTask/>}/>
          <Route path="/admin/tasks" element={<ManageTask/>}/>
          <Route path="/admin/users" element={<ManageUser/>}/>
        </Route>

        {/* Users Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
          <Route path="/user/dashBoard" element={<UserDashboard/>}/>
          <Route path="/user/tasks" element={<MyTask/>}/>
          <Route path="/user/task-details/:id" element={<ViewTaskDetails/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
