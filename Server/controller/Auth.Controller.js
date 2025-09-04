import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../module/User.Module.js";

const register = async (req, res) => {
  const { username, email, password, profileImageUrl, adminInviteToken } =
    req.body;
  //   console.log("Password : ", password);

  if (!username || !email || !password) {
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
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
      },
      token,
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
      token,
      user: {
        id: existUser._id,
        username: existUser.username,
        email: existUser.email,
        role: existUser.role,
        profileImageUrl : existUser.profileImageUrl
      },
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    console.log("User is enterning in the profile page");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.json({
        success: false,
        message: "User is not found please check the login ",
      });
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.profileImageUrl = req.body.profileImageUrl || user.profileImageUrl;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updateUser = await user.save();

    return res.json({
      success: true,
      message: "Update Profile SuccessFully ",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.json({ success: false, message: "File is not upload" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  return res.json({
    success: true,
    message: "Image Uploaded Successfully",
    imageUrl: imageUrl,
  });
};
export { register, login, getUserProfile, updateUserProfile, uploadImage };
