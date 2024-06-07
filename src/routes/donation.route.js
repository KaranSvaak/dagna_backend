import { Router } from "express";
import donationController from "../controllers/donation.controller.js";

const router  = Router();

// Register new Role
router .post("/", donationController.donation);
router .get("/success", donationController.paymentSuccess);
router .get("/cancel", (req,res)=>res.status(500).json({status:false,message:"oops something went wrong, please try again"}));
router .post("/register-donation", donationController.registerDonation);
router .get("/get-donation-info", donationController.getDonationInfo);
export default router;  
