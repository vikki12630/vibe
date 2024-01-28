import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createMessage, getMessage, getMessageById } from "../controllers/message.controller.js";

const router = Router();

// secure routes

router.route("/:conversationId").get(getMessage);
router.route("/createMessage").post(createMessage);
router.route("/getMessageById/:messageId").get(getMessageById);

export default router;
