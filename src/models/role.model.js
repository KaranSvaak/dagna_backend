import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
  {
    roleName: {
      type: String,
      required: [true, "Role Name is required"],
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);

  
