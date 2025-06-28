import express from "express";
import { ChatController } from "./chat.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post("/", auth(), ChatController.createChat);
router.get("/:userId", ChatController.userChats);
router.get("/find/:firstId/:secondId", ChatController.findChat);

export const ChatRoutes = router;