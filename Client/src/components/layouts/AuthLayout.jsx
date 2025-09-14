import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 bg-white">
        <img src="/logo.png" className="w-40 h-35 "></img>
        {children}
      </div>

      {/* Right Side - Blue Background + Image */}
      <div className="hidden md:flex w-full md:w-1/2 bg-blue-500 items-center justify-center">
        <img
          src="/task-manager-imgs.png"
          alt="Task Manager"
          className="w-3/4 max-w-md object-contain"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
