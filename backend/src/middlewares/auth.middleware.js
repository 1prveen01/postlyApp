import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/users.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv"

dotenv.config()

export const verifyJWT = asyncHandler(async (req, res , next) => {
  try {
    const token = req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    

    if (!token) {
      throw new apiError(401, "Unauthorized Request");
    }

    
    const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      // todo: karna baki hai
      throw new apiError(401, "Invalid access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid access Token");
  }
});