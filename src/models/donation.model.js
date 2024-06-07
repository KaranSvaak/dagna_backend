import mongoose, { Schema } from "mongoose";

const donationSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    donation: {
        type: Number,
        default: 0,
      },    
},
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
