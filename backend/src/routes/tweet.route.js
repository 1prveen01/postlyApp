

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getAllTweets, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router();

router.route("/create-tweet").post(verifyJWT , createTweet)
router.route("/update-tweet/:tweetId").patch(verifyJWT, updateTweet)
router.route("/delete-tweet/:tweetId").delete(verifyJWT, deleteTweet)
router.route("/get-user-tweets").get(verifyJWT, getUserTweets)
router.route("/get-all-tweets").get( verifyJWT , getAllTweets)

export default router;