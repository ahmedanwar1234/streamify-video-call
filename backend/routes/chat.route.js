import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamTOken } from "../controllers/chat.controller.js";

const router=express.Router()

router.get("/token",protectRoute,getStreamTOken)

export default router


