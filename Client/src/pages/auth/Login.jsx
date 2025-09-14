import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import {Link} from 'react-router-dom'

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    // Email Checking
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invlaid Email Formate";
    }

    // Password Checking
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be least 8 character";
    }

    
    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Login Successfull");
      setEmail("");
      setPassword("");
    }
  };
  return (
    <>
      <AuthLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Welcome Back !!</h1>
          <p className="pb-3">Please Enter Your Details to Login.</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="font-semibold">Email</label>
              <br />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-1 p-2 w-full rounded-lg focus:outline-none focus:ring-0"
                placeholder="abc@gmail.com"
              />
              {error.email && (
                <p className="text-red-500 text-sm"> {error.email}</p>
              )}
            </div>
            <div className="pt-3 relative">
              <label className="font-semibold">Password</label>
              <br />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                className="border-1 p-2 w-full rounded-lg focus:outline-none focus:ring-0"
                placeholder="Min 8 Characters Required"
                onChange={(e) => setPassword(e.target.value)}
              />
              {error.password && (<p className="text-red-500 text-sm">{error.password} </p>)}
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-12 text-sm text-blue-600 hover:cursor-pointer text-blue-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="pt-3">
              <input
                type="submit"
                value="Login"
                className="border-1 p-2 w-full rounded-lg bg-blue-600 font-bold text-white hover:cursor-pointer hover:bg-blue-700"
              />
            </div>
          </form>
          <p className="pt-5"> Don't have an account ? <Link to="/signup"className="text-blue-600 hover:underline cursor-pointer "> SignUp </Link></p>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;
