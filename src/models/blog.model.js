import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
    en:{
        blogAuthorName: {
            type: String,
            required: true
        },
        blogTitle: {
            type: String,
            required: true
        },
        blogDescription: {
            type: String,
            required: true
        }
    },
    fr:{
        blogAuthorName: {
            type: String,
            required: true
        },
        blogTitle: {
            type: String,
            required: true
        },
        blogDescription: {
            type: String,
            required: true
        }
    },
    de:{
        blogAuthorName: {
            type: String,
            required: true
        },
        blogTitle: {
            type: String,
            required: true
        },
        blogDescription: {
            type: String,
            required: true
        }
    },
    blogImage: {
        type: String
    },
    pdfFileForBlog: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
 { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;