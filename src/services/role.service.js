import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { validateRoleDetails, validateObjectId } from "../helpers/helper.methods.js";


//Register a new Role
const registerRole = async (roleDetail) => {
  const { roleName } = roleDetail;
  if (!roleName || roleName.trim() === "")
  {
    throw new apiError(400, "Role name is required"); 
  }

  const existingRole = await Role.findOne({roleName});
  if (existingRole) {
    throw new apiError(400, "Role name already exists"); 
  }

  const newRole = await Role.create({ roleName });
  
  if (!newRole) {
    throw new apiError(500, "Something went wrong, while registering the Role");
  }
  return newRole;
};

//Update role
const updateRole = async (roleId, roleDetail) => {  
  validateRoleDetails(roleDetail);
  validateObjectId(roleId, "Invalid roleId");

  const role = await Role.findById(roleId);
  if (!role) {
    throw new apiError(404, "Role not found"); 
  }

  Object.assign(role, roleDetail);
  const updatedRole = await role.save();

  return updatedRole;
};

//Delete role
const deleteRole = async (roleId) => {
  validateObjectId(roleId, "Invalid roleID");

  //If role exist in User table, should not be deleted
  const userWithRole = await User.findOne({ roleId });
  if (userWithRole) {
    throw new apiError(400, "Role is referenced by a user and cannot be deleted"); 
  }

  const deletedRole = await Role.findByIdAndDelete(roleId );
  if (!deletedRole) {
    throw new apiError(400, "Role could not be found or deleted"); 
  }

  return deletedRole;
};

// Get Role
const getRole = async (roleId) => {
  validateObjectId(roleId, "Invalid or missing roleId");

  const role = await Role.findById(roleId);
  if (!role) {
    throw new apiError(400, "Role not found"); 
  }

  return role
};

// Get all Active Roles
const getAllActiveRoles = async () => {
  //TODO: Get Active Roles
  const roles = await Role.find({isActive: true}).sort({ roleName: 1 });
  if (!roles) {
    throw new Error(400, "Role(s) not found");
  }
  return roles;
};

// Get all Roles
const getAllRoles = async () => {
  //TODO: Get Active Roles
  
  const roles = await Role.find({}).sort({ roleName: 1 });
  if (!roles) {
    throw new Error(400, "Role(s) not found");
  }
  return roles;
};


export default{
  registerRole,
  updateRole,
  deleteRole,
  getRole,
  getAllActiveRoles,
  getAllRoles,
};
