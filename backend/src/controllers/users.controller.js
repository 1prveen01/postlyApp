import {asyncHandler} from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary , cloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { getPublicIdFromUrl } from "../utils/getPublicIdFromUrl.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating Refresh and Access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if ([username, email, password, fullName].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const exitedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exitedUser) {
    throw new apiError(409, "User with username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new apiError(400, "Avatar is required field");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  // 👉 Generate Tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  // 👉 Set Cookies
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        201,
        {
          user: createdUser,
          accessToken,
          refreshToken,
        },
        "User Registered & Logged In Successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  //req body from data
  //username or email
  //find the user
  //password check
  //access and refresh token
  //cookies

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new apiError(400, "Username or email is required");
  }

  //find user and email whichever find first
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  //if user not find
  if (!user) {
    throw new apiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "Invalid login credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //cookiesOptions
  const options = {
    httpOnly: true,
    secure: true, // required on HTTPS
    sameSite: "none", // allow cross-origin (Vercel <-> Render)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken,
          accessToken,
        },
        "User Logged In Successfully"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findOneAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",        
  };

  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new apiResponse(200, {}, "User logged Out"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized Request");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new apiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true, 
      secure: true, 
      sameSite: "none", // allow cross-origin (Vercel <-> Render)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user?._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confPassword } = req.body;

  if (!(newPassword === confPassword)) {
    throw new apiError(400, "new Pass and cnf Pass does not match");
  }
  const user = await User.findById(req.user?._id);

  //check if old is password is correct or not
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new apiError(400, "old Password is incorrect");
  }

  user.password = newPassword;
  user.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body;

  if (!email || !fullName) {
    throw new apiError(400, "All feilds are required");
  }

  const userUpdated = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(
      new apiResponse(200, userUpdated, "Accounts details updated successfully")
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new apiError(400, "missing avatar local file path");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new apiError(400, "Error while uploading on avatar");
  }

  const existingUser = await User.findById(req.user?._id);
  const oldAvatarPublicId = getPublicIdFromUrl(existingUser.avatar);

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  if (oldAvatarPublicId) {
    await cloudinary.uploader.destroy(oldAvatarPublicId);
  }

  return res
    .status(200)
    .json(new apiResponse(200, updatedUser, "Avatar updated successfully"));
});



const deleteUserAccount = asyncHandler(async (req, res) => {
  try {
    console.log("User in request:", req.user);

    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ error: "User ID not found in request" });
    }

    // Delete all videos owned by this user
    const deletedVideos = await Video.deleteMany({ owner: userId });
    console.log(
      `Deleted ${deletedVideos.deletedCount} videos for user ${userId}`
    );

    // Delete the user
    await User.findByIdAndDelete(userId);

    const orphanDeleted = await Video.deleteMany({
      owner: { $exists: true, $nin: await User.distinct("_id") },
    });

    console.log(`Cleaned ${orphanDeleted.deletedCount} orphaned videos`);

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          {},
          "User and all their videos deleted successfully"
        )
      );
  } catch (error) {
    console.error("Error deleting user account:", error);
    return res.status(500).json({ error: "Failed to delete user account" });
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  deleteUserAccount,
};