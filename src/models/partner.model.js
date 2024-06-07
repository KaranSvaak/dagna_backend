import mongoose, { Schema } from "mongoose";

const partnerSchema = new Schema({
    partnerName: {
        type: String,
        required: true
    },
    partnerImage: {
        type: String,
        default:"" 
    },
    partnerWebsite: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
 { timestamps: true }
);

export const Partner = mongoose.model("Partner", partnerSchema);