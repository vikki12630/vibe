import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  avatarUploadOnCloudinary,
  deleteOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

// sign up/ create user

const signUp = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (!fullName || !username || !email || !password) {
    throw new ApiError(400, "all feilds are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(401, "user alredy exist with this username/ email");
  }

  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar?.secure_url || "",
    avatarPublicId: avatar?.public_id || "",
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "unable to sign up");
  }

  const token = user.generateAccessToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };

  return res
    .status(201)
    .cookie("token", token, options)
    .json(
      new ApiResponse(
        200,
        {
          user: createdUser,
        },
        "user created"
      )
    );
});

// sign user
const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "all feilds required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const verifyUser = await user.isPasswordCorrect(password);

  if (!verifyUser) {
    throw new ApiError(403, "invalid email or password");
  }

  const signedInUser = await User.findById(user._id).select("-password");

  const token = user.generateAccessToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(200,  signedInUser, "user signed in successfully ")
    );
});

// logout user

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});

// get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user fetched successfully"));
});

// get user profile from params 

const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select(
    "-password -updatedAt -createdAt -avatarPublicId"
  );

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  return res.status(201).json(new ApiResponse(200, { user }, "user fetched"));
});
// get user profile from req.body

const getUserDetailsReqBody = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const user = await User.findById(id).select(
    "-password -updatedAt -createdAt -avatarPublicId"
  );

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  return res.status(201).json(new ApiResponse(200, { user }, "user fetched"));
});

// search user query with username or fullname
const searchUserWithUsernameOrFullName = asyncHandler(async (req, res) => {
  const users = String(req.query.search);

  if (users.length === 0) {
    throw new ApiError(400, "search feild empty");
  }

  const query = {
    $or: [
      { fullName: { $regex: users, $options: "i" } },
      { username: { $regex: users, $options: "i" } },
    ],
  };

  const searchUser = await User.find(query).select(
    "-password -createdAt -updatedAt"
  );

  if (searchUser.length < 1) {
    throw new ApiError(404, "user not found")
  }

  return res.status(200).json(new ApiResponse(200, searchUser));
});

//  follow unfollow user
const followUnfollowUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id) {
      throw new ApiError(400, "you cannot follow or unfollow yourself");
    }

    if (!userToModify || !currentUser) {
      throw new ApiError(404, "user not found");
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // unfolow user
      await User.findByIdAndUpdate(req.user._id, {
        $pull: {
          following: id,
        },
      });

      await User.findByIdAndUpdate(id, {
        $pull: {
          followers: req.user._id,
        },
      });
      return res
        .status(200)
        .json(new ApiResponse(200, `user unfollowed ${req.user.username}`));
    } else {
      //follow user
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          following: id,
        },
      });

      await User.findByIdAndUpdate(id, {
        $push: {
          followers: req.user._id,
        },
      });
      return res
        .status(200)
        .json(new ApiResponse(200, `user followed ${req.user.username}`));
    }
  } catch (error) {
    return res.status(400).json(new ApiResponse(400, "", error.message));
  }
});

// update username

const updateUsername = asyncHandler(async (req, res) => {
  const { newUsername } = req.body;

  if (!newUsername) {
    throw new ApiError(400, "new username is required");
  }

  const existingUsername = await User.findOne({
    username: newUsername.toLowerCase(),
  });

  if (existingUsername) {
    throw new ApiError(400, "username already exist try another");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      username: newUsername.toLowerCase(),
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, {}, "username updated"));
});

// update fullName
const updateFullName = asyncHandler(async (req, res) => {
  const { newFullName } = req.body;

  if (!newFullName) {
    throw new ApiError(400, "new Full Name is required");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      fullName: newFullName,
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, {}, "fullName updated"));
});

// update email
const updateEmail = asyncHandler(async (req, res) => {
  const { newEmail } = req.body;

  if (!newEmail) {
    throw new ApiError(400, "new username is required");
  }

  const existingEmail = await User.findOne({
    email: newEmail,
  });

  if (existingEmail) {
    throw new ApiError(400, "email already exist try another");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      email: newEmail,
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, {}, "email updated"));
});

// update password
const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid old password");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "password changed"));
});

// update avatar
const updateAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  let newAvatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    newAvatarLocalPath = req.files.avatar[0].path;
  }

  if (!newAvatarLocalPath) {
    throw new ApiError(400, "avatar file missing");
  }

  if (user.avatar.length > 0 && user.avatarPublicId.length > 0) {
    await deleteOnCloudinary(user.avatarPublicId);
  }

  const newAvatar = await avatarUploadOnCloudinary(newAvatarLocalPath);

  if (!newAvatar.secure_url || !newAvatar.public_id) {
    throw new ApiError(400, "error while uploading avatar");
  }

  await user.updateOne(
    {
      avatar: newAvatar?.url,
      avatarPublicId: newAvatar?.public_id,
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, {}, "avatar updated"));
});

export {
  signUp,
  signIn,
  logoutUser,
  getCurrentUser,
  getUserDetails,
  searchUserWithUsernameOrFullName,
  followUnfollowUser,
  updateUsername,
  updateFullName,
  updateEmail,
  updatePassword,
  updateAvatar,
  getUserDetailsReqBody,
};
