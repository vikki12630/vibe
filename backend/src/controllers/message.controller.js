import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";

const createMessage = asyncHandler(async (req, res) => {
  const { conversationId, sender, text } = req.body;
  const message = new Message({
    conversationId,
    sender,
    text,
  })
  await message.save();

  const newMessage = await Message.findById(message._id).populate("sender","avatar username fullName")

  await Conversation.findByIdAndUpdate(
    conversationId,
    { $push: { messages: newMessage._id } },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, newMessage, "Message created"));
});

const getMessage = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  })
  
  return res.status(200).json(new ApiResponse(200, messages, "fetchedMessage"));
});

const getMessageById = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId;

  try {
    const message = await Message.findById(messageId)

    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, message, "Fetched message"));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Internal Server Error");
  }
});

export { getMessage, createMessage, getMessageById };
