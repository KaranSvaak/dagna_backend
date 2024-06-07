import { Partner } from "../models/partner.model.js";
import { apiError } from "../utils/apiError.js";
import { deleteImage, validateObjectId } from "../helpers/helper.methods.js";
import path from 'path';

// Get the directory path of the current module file
let currentDir = path.dirname(new URL(import.meta.url).pathname).substring(1);
currentDir = currentDir.replace(/%20/g, ' ')

//Register a new Partner
const registerPartner = async (body, partnerImagePath) => {
    if (!partnerImagePath.length) {
        throw new apiError(400, "Partner image is required");
    }
    
    const { partnerName, partnerWebsite } = body;
    if ([partnerName, partnerWebsite].some((field) => field?.trim() === "")) 
    {
      throw new apiError(400, "All fields are required");
    }

    const existingPartner = await Partner.findOne({partnerName});
    if (existingPartner) {
      deleteImage(partnerImagePath)
      throw new apiError(400, "Partner already exists"); 
    }
  
    const newPartner = await Partner.create({ 
        partnerName,
        partnerWebsite,
        partnerImage: partnerImagePath,
     });
    
    if (!newPartner) {
        deleteImage(partnerImagePath)
        throw new apiError(500, "Something went wrong, while registering the Partner");
    }
    return newPartner;
  };

//Update partner
const updatePartner = async (body, partnerId, partnerImagePath=null) => {
  validateObjectId(partnerId, "Invalid partner Id")
  
  const { partnerName, partnerWebsite } = body;
  if ([partnerName, partnerWebsite].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const partner = await Partner.findById(partnerId);
  if(!partner) {
    if(partnerImagePath) deleteImage(partnerImagePath);
    throw new apiError(404, "Partner Not Found");
  }
  
  if (partnerImagePath) {
    deleteImage(path.join(currentDir, '..','..', partner.partnerImage));
    partner.partnerImage = partnerImagePath;
  }

  partner.set(body);
  const updatedPartner = await partner.save();

  return updatedPartner;
}
const statusUpdatePartner = async (body, partnerId) => {
  validateObjectId(partnerId, "Invalid partner Id")
  
  const { isActive } = body;
  if (!String(isActive)) {
    throw new apiError(400, "isActive field is required");
  }

  const partner = await Partner.findById(partnerId);
  if(!partner) {
    throw new apiError(404, "Partner Not Found");
  }


  partner.set({isActive});
  const updatedPartner = await partner.save();

  return updatedPartner;
}

//Delete Partner
const deletePartner = async (partnerId) => {
  validateObjectId(partnerId, "Invalid partnerId")

  const deletedPartner = await Partner.findByIdAndDelete(partnerId );
  if (!deletedPartner) {
    throw new apiError(400, "Partner not found to delete");
  }
   //Remove existing partner image if it exists
    deleteImage(path.join(currentDir, '..','..', deletedPartner.partnerImage))
    return deletedPartner;
};

// Get all Partners
const getAllPartners = async () => {
  const partners = await Partner.find({});
  if (!partners) {
    throw new Error(400, "Partner(s) not found");
  }
  return partners;
};

// Get partner by Id
const getPartner = async (partnerId) => {
  validateObjectId(partnerId, "Either invalid, or partnerId is missing")
  const partner = await Partner.findById(partnerId);
  if (!partner) {
    throw new apiError(400, "Partner not found"); 
  }
  return partner
};

  export default {
    registerPartner,
    updatePartner,
    deletePartner,
    getAllPartners,
    getPartner,
    statusUpdatePartner
  };