import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//  post creation
const createPost = asyncHandler(async (req, res) => {
  const { postedBy, text } = req.body;

  if (!postedBy) {
    throw new ApiError(400, "to create a post postedBy is required");
  }

  const user = await User.findById(postedBy);

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  if (user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(402, "unauthorized to create post");
  }

  let postImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.postImage) &&
    req.files.postImage.length > 0
  ) {
    postImageLocalPath = req.files.postImage[0].path;
  }
  if (!postImageLocalPath) {
    throw new ApiError(400, " file is required");
  }
  const postImage = await uploadOnCloudinary(postImageLocalPath);

  if (!postImage) {
    throw new ApiError(500, "unable to upload on cloudinary");
  }

  const post = await Post.create({
    postedBy,
    text,
    postImage: postImage?.url,
    publicId: postImage?.public_id,
  });

  const createdPost = await Post.findById(post._id);
  if (!createPost) {
    throw new ApiError(500, "unable to create post");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdPost, "post created"));
});

// getting feed posts post which is uploaded by other people and current user
const getFeedPost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const following = user.following;

  const feedPosts = await Post.find({
    postedBy: {
      $in: [...following, user],
    },
  })
    .populate("postedBy", ["_id", "username", "avatar"])
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, feedPosts));
});

// get all the posts of user
const getPosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const userPosts = await Post.find({
    postedBy: {
      $in: user,
    },
  }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, userPosts));
});

// likes & unlike posts
const likeAndUnlikePost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "post not found");
  }

  if (post.postedBy.toString() === req.user._id.toString()) {
    throw new ApiError(400, "can't like your own post");
  }

  const userLikedPost = post.likes.includes(userId);

  if (userLikedPost) {
    // unlike post
    await Post.updateOne(
      { _id: postId },
      {
        $pull: {
          likes: userId,
        },
      },
      { new: true }
    );
    res.status(200).json(new ApiResponse(200, "post unliked "));
  } else {
    // like post
    post.likes.push(userId);
    await post.save();
    res.status(200).json(new ApiResponse(200, "post liked "));
  }
});

// get all posts of other users
const getOtherUserPost = asyncHandler(async (req, res) => {
  
  const user = await User.findById(req.params.id);

  const otherUserPosts = await Post.find({
    postedBy: {
      $in: user,
    },
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, otherUserPosts, "post fetched successfully"));
});

export {
  createPost,
  getFeedPost,
  getPosts,
  likeAndUnlikePost,
  getOtherUserPost,
};
