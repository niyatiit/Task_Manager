import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    // if(!emailRegex.test(email)){
    //   setError("Invlid Syntax Please Renter the Email ");
    //   return;
    // }

    // if(!passwordRegex.test(password)){
    //   setError("Please Enter the password must be 8 unque charcater ");
    //   return;
    // }
    // setError("")
  };
  return (
    <AuthLayout>
      <h1 className="pt-5 font-semibold text-2xl"> Welcome Back !! </h1>
      <p className="pt-2 pb-3">Please Enter Your Details To Loggin. </p>
      <form onSubmit={handleSubmit}>
      <label className="text-0.5xl font-semibold "> Email Address </label> <br></br>
      <input
        type="email"
        placeholder="abc@example.com"
        className="p-3 border-1 font-bold rounded-md w-[100%]"
        required
        rounded-md
      />
      <br></br>
      <label className="text-0.5xl font-semibold pb-3 pt-3 "> Password </label> <br></br>
      <input
        type="password "
        placeholder="Min 8 Character are available "
        className="p-3 border-1 font-bold rounded-md w-[100%]"
        required
        rounded-md
      />
      <br></br>
      <input
        type="submit"
        className="text-0.5xl font-semibold pb-3 pt-3 bg-blue-500 text-white mt-5 rounded-md hover:bg-blue-600 cursor-pointer
"
      />
      <p className="font-semibold pb-3 pt-5">
        Don't Have Any Account ? then{" "}
        <Link className="text-blue-700 hover:underline" to="/signup">
          {" "}
          SignUp{" "}
        </Link>{" "}
      </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
