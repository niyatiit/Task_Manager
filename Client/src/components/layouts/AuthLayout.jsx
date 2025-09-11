import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side: Login Form */}
      <div className="w-full md:w-3/5 px-12 pb-12 pt-[-15%] flex flex-col">
        <img className="h-[30%] w-[30%]" src="https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-82d4-622f-8064-3a0bb2a8e54e/raw?se=2025-09-11T19%3A05%3A39Z&sp=r&sv=2024-08-04&sr=b&scid=c6cfa3a5-5448-5231-841c-6f4bdc2daa15&skoid=bbd22fc4-f881-4ea4-b2f3-c12033cf6a8b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-10T23%3A01%3A43Z&ske=2025-09-11T23%3A01%3A43Z&sks=b&skv=2024-08-04&sig=H%2BQPpGcAxNVYuLA9LO1w1Z/R%2BbraTA/kcmqTKIhiw7Y%3D"></img>

        {children}
      </div>

      {/* Right side: Image */}
      <div
        className="hidden md:flex w-full md:w-2/5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/task-manager-imgs.png')" }}
      ></div>
    </div>
  );
};

export default AuthLayout;
