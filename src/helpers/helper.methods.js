import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { isValidObjectId } from "mongoose";
import fs from 'fs';

// Password validation Method
const validatePassword = (password) => {
  // Define the regex pattern for password validation
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[^\w\d\s]).{6,}$/;

  // Test the password against the regex pattern
  return passwordRegex.test(password);
};

// Email validation Methods
const validateEmail = (email) => {
  // Regular expression for basic email validation
  const emailRegex = /^\S+@\S+\.\S{2,}$/;
  return emailRegex.test(email);
};

// Delete Image from given path
const deleteImage = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    try {
      fs.unlinkSync(imagePath);
      console.log(`Removed existing image: ${imagePath}`);
    } catch (err) {
      console.error("Error occurred while deleting file:", err);
    }
    } else {
      console.log("File does not exist:", imagePath);
    }
  return;
};

// Helper function to handle responses
const handleResponse = (res, statusCode, data, message) => {
  return res.status(statusCode).json(new apiResponse(statusCode, data, message));
};

// Helper function to handle errors
const handleError = (res, error) => {
  return res.status(500).json(new apiError({ statusCode: error.statusCode, message: error.message }));
};

// Helper function to validate role details
const validateRoleDetails = (roleDetail) => {
  if (!roleDetail || typeof roleDetail !== "object") {
    throw new apiError(400, "Invalid role details");
  }
};

// Helper function to validate ObjectId
const validateObjectId = (id, message) => {
  if (!isValidObjectId(id) || !id?.trim()) {
    throw new apiError(400, message);
  }
};

export {  
  validatePassword, 
  validateEmail, 
  deleteImage,
  handleResponse,
  handleError,
  validateRoleDetails,
  validateObjectId
};
