import { sendOTPEmail } from "../lib/email.js";
import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password length must be 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json("Invalid email format");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const idx = Math.floor(Math.random() * 100) + 1;
    const avatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: avatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("error creating stream user", error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
    const isPasswordMatched = await user.matchPassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.fullName,
        image: user.profilePic || "",
      });
      console.log(`Stream user synced on login for ${user.fullName}`);
    } catch (streamError) {
      console.log("Error creating stream user on login:", streamError.message);
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid Email format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If your email is registered, you will receive an email shortly",
      });
    }

    const otp = user.generateOTP();
    await user.save();

    try {
      await sendOTPEmail(user.email, otp, user.fullName);
      console.log(`Password reset otp sent to ${user.email}`);
      res.status(200).json({
        success: true,
        message: "OTP sent to your email, please check your inbox",
      });
    } catch (emailError) {
      user.clearOTP();
      await user.save();
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error in forgotPassword controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email or OTP are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email or OTP" });
    }
    const isOTPValid = user.verifyOTP(otp);
    if (!isOTPValid) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP, Please request a new one" });
    }
    return res
      .status(200)
      .json({ success: true, message: "OTP Verified successfully" });
  } catch (error) {
    console.error("Error in verifyOTP controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !password || !otp) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP" });
    }
    const isOTPValid = user.verifyOTP(otp);
    if (!isOTPValid) {
      return res.status(400).json({
        message: "Invalid OTP or expired OTP, please request a new one",
      });
    }

    user.password = newPassword;
    user.clearOTP();
    await user.save();

    try {
      await sendPasswordResetSuccessEmail(user.email, user.fullName);
    } catch (emailError) {
      console.error("Failed to send password reset success email:", emailError);
      // Don't fail the request if success email fails
    }

    console.log(`Password reset successful for ${user.email}`);
    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Error in resetPassword controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function resendOTP(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If your email is registered, you will receive an OTP shortly",
      });
    }
    const otp = user.generateOTP();
    await user.save();

    try {
      await sendOTPEmail(user.email, otp, user.fullName);
      console.log(`OTP resent to ${user.email} `);
      res.status(200).json({
        success: true,
        message: "New OTP sent to your email.",
      });
    } catch (error) {
      console.error("Failed to resend OTP email:", emailError);
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error in resendOTP controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !bio && "bio",
          !location && "location",
        ],
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullName}`
      );
    } catch (streamError) {
      console.log(
        "Error updating stream user during onboarding :",
        streamError.message
      );
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Onboarding error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
