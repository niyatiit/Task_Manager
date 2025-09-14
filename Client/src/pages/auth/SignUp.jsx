import { useState } from "react";
import React from "react";
import AuthLayout from "../../components/layouts/AuthLayout";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      console.log(
        "Fullname : ",
        fullName,
        "Email : ",
        email,
        "Password : ",
        password,
        "Admin Token : ",
        adminToken
      );
      alert("Registration Successfull");
      setFullName("");
      setEmail("");
      setPassword("");
      setAdminToken("");
    }
  };
  return (
    <>
      <AuthLayout>
        <div className="p-5">
          <h1 className="text-2xl font-bold"> Create an Account </h1>
          <p> Join us today by entering your details below. </p>
          <div className="flex justify-center pt-10 relative">
            {/* Profile Icon */}
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center relative">
              <img
                className="w-10 h-10"
                src="https://cdn0.iconfinder.com/data/icons/multimedia-solid-30px/30/user_account_profile-512.png"
                alt="Profile"
              />

              {/* Upload Button */}
              <label
                htmlFor="fileInput"
                className="absolute bottom-0 right-0 bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700"
              >
                ⬆
              </label>
              <input type="file" id="fileInput" className="hidden" />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="pt-10">
              <label className="font-bold "> Full Name </label>
              <br />
              <input
                className="border-1 p-2 w-full rounded-lg focus:outline-none focus:ring-0"
                type="text"
                placeholder="Niyati"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="pt-5">
              <label className="font-bold "> Email Address </label>
              <br />
              <input
                className="border-1 p-2 w-full rounded-lg focus:outline-none focus:ring-0"
                type="email"
                placeholder="niyati@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="pt-5 relative">
              <label className="font-bold "> Password </label>
              <br />
              <input
                className="border-1 p-2 w-full rounded-lg focus:outline-none focus:ring-0"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 Character "
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error.password && (
                <p className="text-red-500 text-sm"> {error.password} </p>
              )}
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-14 text-sm text-blue-600 hover:cursor-pointer text-blue-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="pt-5 pb-5">
              <label className="font-bold "> Admin Invite Token </label>
              <br />
              <input
                className="border-1 p-2 w-full rounded-lg focus:outline-none focus:ring-0"
                type="text"
                placeholder="6 Digit Code"
                required
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
              />
            </div>
            <div className="">
              <input
                className="border-1 p-2 w-full rounded-lg focus:outline-none focus:ring-0 bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer "
                type="submit"
                value="Sign up"
              />
            </div>
          </form>
        </div>
      </AuthLayout>
    </>
  );
};

export default SignUp;
