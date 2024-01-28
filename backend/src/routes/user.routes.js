import { Router } from "express";
import {
  followUnfollowUser,
  getCurrentUser,
  getUserDetails,
  logoutUser,
  searchUserWithUsernameOrFullName,
  signIn,
  signUp,
  updateAvatar,
  updateEmail,
  updateFullName,
  updatePassword,
  updateUsername,
  getUserDetailsReqBody,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/signUp").post(signUp);

router.route("/signIn").post(signIn);

router.route("/getUserDetails/:id").get(getUserDetails);

// secure routes

router.route("/logout").get(verifyJWT, logoutUser);

router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);

router.route("/searchUser").get(verifyJWT, searchUserWithUsernameOrFullName);

router.route("/follow/:id").get(verifyJWT, followUnfollowUser)

router.route("/getUserDetailsReqBody").get(verifyJWT, getUserDetailsReqBody);

   // update routes
router.route("/updateUsername").put(verifyJWT, updateUsername);

router.route("/updateFullName").put(verifyJWT, updateFullName);

router.route("/updateEmail").put(verifyJWT, updateEmail);

router.route("/updatePassword").put(verifyJWT, updatePassword);

router.route("/updateAvatar").put(
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateAvatar
);


export default router;
