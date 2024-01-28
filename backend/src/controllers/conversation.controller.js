import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Conversation } from "../models/conversation.model.js";
import mongoose from "mongoose";

const createConversation = asyncHandler(async (req, res) => {
  const { participants } = req.body;
  const participantObjectIds = participants.map((id) =>
   new mongoose.Types.ObjectId(id)
  );

  const existingConversation = await Conversation.find({
    participants: {
      $all: participantObjectIds,
    },
  }).populate("participants", "username fullName avatar");
  if (existingConversation.length > 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, existingConversation[0], "existing Conversation")
      );
  }
  const conversation = new Conversation({ participants });
  await conversation.save();

  const newConversation = await Conversation.findById(
    conversation._id
  ).populate("participants", "username fullName avatar");
  return res
    .status(200)
    .json(new ApiResponse(200, newConversation, "Conversation created"));
});

const getAllConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.find({
    participants: req.params.userId,
  })
    .populate({
      path: "messages",
      options: { sort: { createdAt: -1 } },
    })
    .populate("participants", "username fullName avatar")
    .sort({ updatedAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, conversation, "fetchedConversation"));
});

export { getAllConversation, createConversation };
