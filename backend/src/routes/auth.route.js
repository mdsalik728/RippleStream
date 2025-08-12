import express from "express";
import {onboard, signup} from "../controllers/auth.controller.js";
import {login} from "../controllers/auth.controller.js";

import {logout} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

 const router=express.Router();
 router.post("/signup",signup);
  router.post("/login",login);
  router.post("/logout",logout);

  //forgot password route
  
  router.post("/onboarding",protectRoute,onboard);

  router.get("/me",protectRoute,(req,res)=>{
    return res.status(200).json({message:"user logged in"});
  })

export default router;