import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createConversation, getAllConversation } from "../controllers/conversation.controller.js"


const router = Router();

// secure routes

router.route("/:userId").get( getAllConversation);
router.route("/createConversation").post(createConversation);




export default router;