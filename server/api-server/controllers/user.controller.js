import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../../shared/models/user.model.js";
import { Store } from "../../shared/models/store.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";

export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(err.status || 500, err.message);
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  if (
    [username, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All credenetials are required");
  }

  const validateEmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  if (!validateEmail(email)) {
    throw new ApiError(400, "Please provide a valid Gmail address");
  }

  const existedUser = await User.find({
    $or: [{ username }, { email }],
  });

  if (existedUser?.length > 0) {
    throw new ApiError(400, "username or email already taken");
  }

  const avatarLocalPath = req.file?.path;
  let avatar;
  if (avatarLocalPath) {
    const response = await uploadOnCloudinary(avatarLocalPath, "avatars");
    if (!response) {
      throw new ApiError(500, "Error occured while uploading the image");
    }
    avatar = response?.url;
  }

  const user = await User.create({
    username: username?.toLowerCase(),
    fullName: fullName,
    email: email?.toLowerCase(),
    password,
    avatar: avatar || null,
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error occured while registering the user");
  }
  // for email sending
  const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // expires in 15 minutes

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // 🔗 Create verification link and send mail
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?email=${user.email}&otp=${otp}`;
  await sendMail({
    to: user.email,
    subject: "Verify your Email - Anbari",
    html: `
  <div style="max-width:600px;margin:auto;font-family:'Segoe UI',sans-serif;background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
    <!-- Header with gradient, logo -->
    <div style="background:linear-gradient(135deg,#7C3AED,#3B82F6);padding:20px;text-align:center;color:white;">
      <h1 style="margin:0;">Verify Your Email</h1>
    </div>

    <!-- Illustration -->
    <div style="text-align:center;padding:20px 0;">
      <img src="https://cdn-icons-png.flaticon.com/512/270/270798.png" alt="Email Verification Illustration" width="150" style="opacity:0.8;" />
    </div>

    <!-- Body content -->
    <div style="padding:30px;text-align:center;">
      <p style="font-size:16px;color:#4B5563;">Hello <strong>${
        user.fullName
      }</strong>,</p>
      <p style="font-size:15px;color:#6B7280;">Use the OTP below to verify your email address or click the button to verify directly.</p>
      <h2 style="margin:20px auto;font-size:28px;color:#7C3AED;background:#F3F4F6;padding:10px 20px;display:inline-block;border-radius:8px;">${otp}</h2>
      <a href="${verificationLink}" style="display:inline-block;margin-top:20px;background:#3B82F6;color:white;padding:12px 25px;text-decoration:none;border-radius:6px;font-weight:bold;">Verify Email</a>
      <p style="font-size:13px;color:#9CA3AF;margin-top:30px;">This OTP/link expires in 15 minutes. If you didn't request this, please ignore.</p>
    </div>

    <!-- Footer with social links -->
    <div style="background:#F9FAFB;padding:20px;text-align:center;font-size:14px;color:#6B7280;">
      <p style="margin-bottom:10px;">Connect with us:</p>
      <a href="https://facebook.com/siddthecoder" style="margin: 0 8px; display:inline-block;" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" />
      </a>
      <a href="https://instagram.com/siddhant_.ydv" style="margin: 0 8px; display:inline-block;" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" width="24" />
      </a>
      <a href="https://github.com/siddthecoder" style="margin: 0 8px; display:inline-block;" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" width="24" />
      </a>
      <a href="https://linkedin.com/in/siddthecoder" style="margin: 0 8px; display:inline-block;" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" width="24" />
      </a>
      <p style="margin-top:15px;font-size:12px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} Anbari. All rights reserved.</p>
    </div>
  </div>
  `,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // cookie settings
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: createdUser,
          accessToken: accessToken,
        },
        "User Registered Successfully"
      )
    );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!(username || email))
    throw new ApiError(400, "Email or Username is required");
  if (!password) throw new ApiError(400, "Password is required");

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password didnt Matched");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // cookie settings
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: accessToken,
        },
        "User Logged in Successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  // cookie settings
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        {
          user: null,
          accessToken: null,
        },
        "User Logout Successfully"
      )
    );
});

export const promoteUserToSeller = asyncHandler(async (req, res) => {
  const { address, phoneNumber, age } = req.body;

  if ([address, phoneNumber, age].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All credenetials are required");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(400, "User Not Found for promotion to seller");
  }

  if (user.role === "seller") {
    throw new ApiError(400, "User is already a seller");
  }

  user.age = age;
  user.phoneNumber = phoneNumber;
  user.address = address;

  user.role = "seller";
  user.isSeller = true;
  user.generateSellerId(); // this method sets sellerId + isSeller
  await user.save();

  // 🔗 sending mail to greet user
  await sendMail({
    to: user.email,
    subject: "Welcome to Anbari Marketplace — You’re Now a Seller!",
    html: `
      <div style="max-width:600px;margin:auto;font-family:'Segoe UI',sans-serif;background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
        <!-- Header with gradient, logo -->
        <div style="background:linear-gradient(135deg,#7C3AED,#3B82F6);padding:20px;text-align:center;color:white;">
          <h1 style="margin:0;">You're Officially a Seller on Anbari!</h1>
        </div>
    
        <!-- Illustration -->
        <div style="text-align:center;padding:20px 0;">
          <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" alt="Welcome Seller" width="150" style="opacity:0.9;" />
        </div>
    
        <!-- Body content -->
        <div style="padding:30px;text-align:center;">
          <p style="font-size:16px;color:#4B5563;">Hello <strong>${
            user.fullName
          }</strong>,</p>
          <p style="font-size:15px;color:#6B7280;">Congratulations on becoming a seller on <strong>Anbari</strong>! 🎉</p>
          <p style="font-size:15px;color:#6B7280;">You’ve unlocked access to seller tools, product listings, and a growing customer base.</p>
          <p style="margin: 20px 0; font-size:16px; color:#10B981;"><strong>Your Seller ID:</strong> ${
            user.sellerId
          }</p>
          <a href="https://anbari.com/seller/dashboard" style="display:inline-block;margin-top:20px;background:#3B82F6;color:white;padding:12px 25px;text-decoration:none;border-radius:6px;font-weight:bold;">Go to Seller Dashboard</a>
          <p style="font-size:13px;color:#9CA3AF;margin-top:30px;">Need help getting started? Our seller support team is just one message away.</p>
        </div>
    
        <!-- Footer with social links -->
        <div style="background:#F9FAFB;padding:20px;text-align:center;font-size:14px;color:#6B7280;">
          <p style="margin-bottom:10px;">Connect with us:</p>
          <a href="https://facebook.com/siddthecoder" style="margin: 0 8px;" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" />
          </a>
          <a href="https://instagram.com/siddhant_.ydv" style="margin: 0 8px;" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" width="24" />
          </a>
          <a href="https://github.com/siddthecoder" style="margin: 0 8px;" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" width="24" />
          </a>
          <a href="https://linkedin.com/in/siddthecoder" style="margin: 0 8px;" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" width="24" />
          </a>
          <p style="margin-top:15px;font-size:12px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} Anbari. All rights reserved.</p>
        </div>
      </div>
      `,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User Promoted to Seller"));
});

export const getCurrentUser = asyncHandler((req, res) => {
  const user = req.user;

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Current User Fetched Successfully"));
});

export const updateUserCredentials = asyncHandler(async (req, res) => {
  const {
    phoneNumber,
    address,
    shippingAddress,
    city,
    country,
    district,
    postalCode,
    age,
  } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        phoneNumber,
        address,
        shippingAddress: shippingAddress || req.user.email,
        city,
        country,
        district,
        age,
        postalCode,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user }, "User Credentials Updated Successfully")
    );
});
