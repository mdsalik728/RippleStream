import express from "express";
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutGoingFriendReqs, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router=express.Router();




router.use("/",protectRoute);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

//send friend request
router.post("/friend-request/:id",sendFriendRequest);

//acccept friend request

router.put("/friend-request/:id/accept",acceptFriendRequest);

//get pending requests
router.get("/friend-requests/",getFriendRequests);

//get Outgoing requests

router.get("/outgoing-friend-requests",getOutGoingFriendReqs);

export default router;

