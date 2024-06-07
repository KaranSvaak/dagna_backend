import { Router } from "express";

import upload from "../middlewares/multer.middleware.js";

import { registerPartner, updatePartner, deletePartner, getAllPartners, getPartner, statusUpdatePartner } from "../controllers/partner.controller.js";

const partnerRouter = Router();

// Register new partner
partnerRouter.post("/register", upload("partners").array("partnerImage", 1), registerPartner);

//Update partner
partnerRouter.patch("/update/:id", upload("partners").array("partnerImage", 1), updatePartner);
partnerRouter.patch("/update-status/:id", statusUpdatePartner);

//Delete Partner permanently
partnerRouter.delete("/delete/:id", deletePartner)

//Get all Partners
partnerRouter.get("/get-partners", getAllPartners);

//Get Partner by Id
partnerRouter.get("/get-partner/:id", getPartner);

export default partnerRouter;