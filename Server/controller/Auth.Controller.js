import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../module/User.Module.js";

const register = async (req, res) => {
  const { username, email, password, profileImageUrl, adminInviteToken } =
    req.body;
  //   console.log("Password : ", password);

  if (!username || !email || !password || !profileImageUrl) {
    return res.json({ success: false, message: "Please Enter All Fields" });
  }
  try {
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.json({ success: false, message: "User is already exist" });
    }

    let role = "member";
    if (
      adminInviteToken &&
      adminInviteToken == process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }
    const hashPassword = await bcrypt.hash(password, 10);
    // console.log("Password : ", hashPassword);

    const user = new User({
      username,
      email,
      password: hashPassword,
      profileImageUrl,
      role,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000, // ✅ number, 2 days
    });

    return res.json({
      success: true,
      message: "Registration Successfully",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Email : ", email);

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email End Password are required ",
    });
  }

  try {
    const existUser = await User.findOne({ email });

    if (!existUser) {
      return res.json({
        success: false,
        message: "User not found please enter the valid email",
      });
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Password is incorect please enter the correct password",
      });
    }

    const token = jwt.sign({ id: existUser._id }, process.env.SECRET_KEY, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000, // ✅ number, 2 days
    });

    return res.json({
      success: true,
      message: "Login Successfully",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

const getUserProfile = async (req, res) => {
 try{
  const user = await User.findById(req.user.id).select("-password")

  if(!user){
    return res.json({success : false , message : "User not found"})
  }
  res.json(user)
}
catch(err){
  return res.json({success : false , message  :err.message})
}
}


const updateUserProfile = async (req, res) => {};
export { register, login, getUserProfile, updateUserProfile };
