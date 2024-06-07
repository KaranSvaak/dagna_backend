import roleService from "../services/role.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleResponse, handleError } from "../helpers/helper.methods.js";

//Register Role
const registerRole = asyncHandler(async (req, res) => {
  try {
    const roleDetails = req.body;
    const response = await roleService.registerRole(roleDetails);
    return handleResponse(res, 201, response, "Role registered successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Update Role
const updateRole = asyncHandler(async (req, res) => {
  try {
    const { body, params } = req;    
    const response = await roleService.updateRole(params.id, body);
    return handleResponse(res, 202, response, "Role updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Delete Role from DB, if its reference is not in other documents(tables)
const deleteRole = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await roleService.deleteRole( params.id );
    return handleResponse(res, 200, response, "Role deleted successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get Role by Id
const getRole = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await roleService.getRole(params.id);
    return handleResponse(res, 200, response, "Role fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get all active roles
const getAllActiveRoles = asyncHandler(async (req, res) => {
  try {
    const response = await roleService.getAllActiveRoles();    
    return handleResponse(res, 200, response, "Role(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get all roles
const getAllRoles = asyncHandler(async (req, res) => {
  try {
    const response = await roleService.getAllRoles();
    return handleResponse(res, 200, response, "Role(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

export {
  registerRole,
  updateRole,
  deleteRole,
  getRole,
  getAllActiveRoles,
  getAllRoles,
};