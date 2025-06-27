import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMyFriends,getFriendRequests, getRecomendedUsers, sendFriendRequest, acceptRequest, getOutgoingFriendReqs } from "../controllers/user.controllers.js";

const router =express.Router();
router.use(protectRoute)

router.get("/",getRecomendedUsers)
router.get("/friends",getMyFriends)

router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptRequest)
router.get('/friend-requests',getFriendRequests);

router.get("/outgoing-friend-requests",getOutgoingFriendReqs)

export default router