import { isValidObjectId } from "mongoose";
import Blog from "../models/blog.model.js";
import { apiError } from "../utils/apiError.js";
import fs from "fs";
import path from "path";

// Get the directory path of the current module file
let currentDir = path.dirname(new URL(import.meta.url).pathname).substring(1);
currentDir = currentDir.replace(/%20/g, " ");

// Give the access for admin to upload his client blog api's
const uploadBlog = async (
  blogDetails,
  blogImageLocalPath,
  pdfFileForBlogLocalPath,
) => {
  let blog = JSON.parse(JSON.stringify(blogDetails));
  console.log('blog------------------------------------',blog['en.blogTitle']);

  if (!blogImageLocalPath || !pdfFileForBlogLocalPath) {
    throw new apiError(400, "Image and PDF file is required");
  }

  const existingBlog = await Blog.findOne({"en.blogTitle": "blog.en.blogTitle"});
  if (existingBlog) {
    throw new apiError(400, "Blog already exists");
  }

  const newBlog = await Blog.create({
    blogImage: blogImageLocalPath,
    pdfFileForBlog: pdfFileForBlogLocalPath,
    ...blog,
  });

  if (!newBlog) {
    throw new apiError(500, "Something went wrong while uploading the blog");
  }
  return newBlog;
};

const getUploadedBlog = async () => {
  const allBlogs = await Blog.find();
  if (allBlogs.length === 0) {
    throw new apiError(404, "No Blogs Found");
  }
  return allBlogs;
};

// Give the access to the admin to update the blog fields
const updateUploadedBlog = async (
  blogDetails,
  queryParams,
  blogImageLocalPath,
  pdfFileForBlogLocalPath,
) => {
  const { blogId } = queryParams;
  if (!isValidObjectId(blogId)) {
    throw new apiError(400, "Invalid Blog Id Format");
  }

  console.log("blogImageLocalPath", blogImageLocalPath);
  console.log("pdfFileForBlogLocalPath", pdfFileForBlogLocalPath);

  const fetchExistingBlog = await Blog.findById(blogId);
  if (!fetchExistingBlog) {
    throw new apiError(404, "Blog Not Found");
  }

  // Remove existing blog image if it exists
  if (blogImageLocalPath && fetchExistingBlog.blogImage) {
    const imagePath = path.join(currentDir, "..", "..", fetchExistingBlog.blogImage,);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`Removed existing blog image: ${imagePath}`);
    }
  }

  // Remove existing PDF file for blog if it exists
  if (pdfFileForBlogLocalPath && fetchExistingBlog.pdfFileForBlog) {
    const pdfPath = path.join(currentDir, "..", "..", fetchExistingBlog.pdfFileForBlog,);
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
      console.log(`Removed existing PDF file for blog: ${pdfPath}`);
    }
  }

 

  let {blogImage,pdfFileForBlog,...restBlog} = JSON.parse(JSON.stringify(blogDetails));
  // Update other blog details
  if(blogImageLocalPath) restBlog.blogImage = blogImageLocalPath;
  if(pdfFileForBlogLocalPath) restBlog.pdfFileForBlog = pdfFileForBlogLocalPath;
  fetchExistingBlog.set({...restBlog});

  // Save the changes to the blog document
  const updateBlog = await fetchExistingBlog.save();
  return updateBlog;
};

// Give the access to the admin to delete the blog
const deleteUploadedBlog = async (paramsData) => {
  const { blogId } = paramsData;
  if (!isValidObjectId(blogId)) {
    throw new apiError(400, "Invalid Blog Id Format");
  }

  // delete the blog on the basis of blogId
  const deletedBlog = await Blog.findByIdAndDelete(blogId);
  if (!deletedBlog) {
    throw new apiError(404, "Blog Not Found");
  }
  return deletedBlog;
};


const getSingleBlog = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new apiError(404, "No Blog Found");
  }
  return blog;
};

export default {
  uploadBlog,
  getUploadedBlog,
  updateUploadedBlog,
  deleteUploadedBlog,
  getSingleBlog
};
