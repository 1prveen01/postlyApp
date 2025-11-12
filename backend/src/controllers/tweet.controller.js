import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweets.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  const userId = req.user?._id;
  // checking for missing elements
  if (!content) {
    throw new apiError(400, " Content is missing ");
  }
  if (!userId) {
    throw new apiError(400, "user id is missing");
  }

  //creating the tweet
  const postTweet = await Tweet.create({
    content: content,
    owner: userId,
  });
  if (!postTweet) {
    throw new apiError(500, "Failed to create tweet");
  }

  return res
    .status(201)
    .json(new apiResponse(201, postTweet, "Tweet posted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const userId = req.user?._id;
  if (!userId) {
    throw new apiError(400, "User id is missing");
  }
  const { page = 1, limit = 10 } = req.query;

  //skips the tweets
  const skip = (Number(page) - 1) * Number(limit);

  //fetching tweets from the user

  const tweet = await Tweet.find({ owner: userId })
    .populate("owner", "username fullName avatar")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

    //total count of tweets for the user
    const totalTweet = await Tweet.countDocuments({owner : userId})


    //fetched tweets response
  return res.status(200).json(
    new apiResponse(
      200,
      {
        tweet,
        page: Number(page),
        skip: Number(skip),
        totalTweet,
      },
      "Tweets fetched successfully"
    )
  );
  
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const userId = req.user?._id;
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!userId) {
    throw new apiError(400, "userId is missing");
  }

  if (!content || content.trim() === "") {
    throw new apiError(400, "content is missing");
  }

  if (!tweetId) {
    throw new apiError(400, "tweet id is missing");
  }

  // validate the tweet is present or not
  const existingTweet = await Tweet.findById(tweetId);
  if (!existingTweet) {
    throw new apiError(404, "Tweet not found");
  }

  //checking ownership of the tweet
  if (existingTweet.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not allowed to update this tweet");
  }

  //updating tweet
  existingTweet.content = content;
  await existingTweet.save();

  return res
    .status(200)
    .json(new apiResponse(200, existingTweet, "Tweet is updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const userId = req.user?._id;
  const { tweetId } = req.params;
  if (!userId) {
    throw new apiError(400, "user id is missing");
  }

  //deleted tweet
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new apiError(404, "tweet not found");
  }

  //validate the user
  if (tweet.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not allowed to delete this tweet");
  }

  //delete the tweet
  await Tweet.deleteOne({ _id: tweetId });

  return res
    .status(200)
    .json(new apiResponse(200, null, "Tweet deleted successfully"));
});

const getAllTweets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  // Fetch all tweets with user info populated
  const tweets = await Tweet.find({})
    .populate("owner", "username fullName avatar") // include user details
    .sort({ createdAt: -1 }) // newest first
    .skip(skip)
    .limit(Number(limit));

  const totalTweets = await Tweet.countDocuments();

  return res.status(200).json(
    new apiResponse(
      200,
      {
        tweets,
        page: Number(page),
        totalTweets,
      },
      "All tweets fetched successfully"
    )
  );
});



export { createTweet, getUserTweets, updateTweet, getAllTweets, deleteTweet };