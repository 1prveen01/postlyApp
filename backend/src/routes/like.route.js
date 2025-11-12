import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedTweets, toggleTweetLike  ,getTweetLikesCount, getAllTweets } from "../controllers/like.controller.js";


const router = Router();

//tweet like route
router.route("/toggle-tweet-like/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/get-liked-tweets").get(verifyJWT, getLikedTweets)
router.route("/get-tweet-likes-count/:tweetId").get(verifyJWT , getTweetLikesCount)
router.route("/all-tweets").get(verifyJWT,getAllTweets)


export default router;
