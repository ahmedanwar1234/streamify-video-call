import express from "express"
import { login, logout, onboard, signUp } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router =express.Router();

router.post('/signup',signUp)
router.post('/login',login)
router.post('/logout',logout)

// forget-password

router.post('/onboarding',protectRoute,onboard)
router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true,user:req.user})

})
export default router