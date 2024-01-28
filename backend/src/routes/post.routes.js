import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getPosts,
  createPost,
  getFeedPost,
  getOtherUserPost,
  likeAndUnlikePost,
} from "../controllers/post.controller.js";

const router = Router();

router.route("/createPost").post(
  verifyJWT,
  upload.fields([
    {
      name: "postImage",
      maxCount: 1,
    },
  ]),
  createPost
);

router.route("/feed").get(verifyJWT, getFeedPost);

router.route("/like/:id").get(verifyJWT, likeAndUnlikePost);

router.route("/userPosts").get(verifyJWT, getPosts);

router.route("/otherUserPosts/:id").get(getOtherUserPost);


export default router;
