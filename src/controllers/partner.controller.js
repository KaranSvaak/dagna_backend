import partnerService from "../services/partner.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleResponse, handleError } from "../helpers/helper.methods.js";

//Register Partner
const registerPartner = asyncHandler(async (req, res) => {
    try {
      const { body, files } = req;
      const response = await partnerService.registerPartner(body, files?.[0]?.path);
      return handleResponse(res, 201, response, "Partner registered successfully");
    } catch (error) {
      return handleError(res, error);
    }
  });

//Update partner
const updatePartner = asyncHandler(async (req, res) => {
  try {
    const { body, params, files } = req;
    const response =  await partnerService.updatePartner(body, params.id, files?.[0]?.path)
    return handleResponse(res, 202, response, "Partner updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

const statusUpdatePartner = asyncHandler(async (req, res) => {
  try {
    const { body, params } = req;
    const response =  await partnerService.statusUpdatePartner(body, params.id)
    return handleResponse(res, 202, response, "status updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Delete partner, if its reference is not in other documents(tables)
const deletePartner = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await partnerService.deletePartner( params.id );
    return handleResponse(res, 200, response, "Partner deleted successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get all partners
const getAllPartners = asyncHandler(async (req, res) => {
  try {
    const response = await partnerService.getAllPartners();
    return handleResponse(res, 200, response, "Partner(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

// Get Partner by Id
const getPartner = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await partnerService.getPartner(params.id);
    return handleResponse(res, 200, response, "Partner fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});


  export {
    registerPartner,
    updatePartner,
    deletePartner,
    getAllPartners,
    getPartner,
    statusUpdatePartner
  };