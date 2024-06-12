import { isValidObjectId } from "mongoose";
import { validateEmail } from "../helpers/helper.methods.js";
import Contact from "../models/contact.model.js";
import { apiError } from "../utils/apiError.js";
import { sendEmail } from "../utils/send.email.js";

// Contact Methods
const createContact = async (contactDetails) => {
  const { firstName, lastName, phoneNumber, email, message } = contactDetails;

  if (!firstName || !phoneNumber || !email || !message) {
    throw new apiError(400, "Missing Fields Are Required");
  }

  //If email address is not valid, throw error
  if (!validateEmail(email)) {
    throw new apiError(400, "Provide valid email address");
  }

  const newContact = new Contact({
    firstName,
    lastName,
    phoneNumber,
    email,
    message,
  });

  const savedContact = await newContact.save();
  if (!savedContact) {
    throw new apiError(400, "Something Went Wrong at the time of data saving");
  }

  const subject = "New Website Inquiry";

  const adminMessage = `
  <p>Hello,</p>

  <p>You have received a new inquiry from your website: </p>

  <b>Name:</b> ${firstName} ${lastName}<br>
  <b>Phone Number:</b> ${phoneNumber}<br>
  <b>Email:</b>${email}<br>
  <b>Message:</b> ${message? message: ''}<br><br>

  <p>Regards,</p>
  Dagna.De
  `;

  // Send the email for new contact user
  await sendEmail('maintenance@dagna.de', subject, adminMessage);

  // Constructing the email message for User
  const userSubject = "Thank you for contacting us!";
  const userMessage = `<p>Dear ${firstName},</p>
  
    <p>Thank you for reaching out to us through our contact form. We have received your message and will get back to you as soon as possible.</p>
    <p>Here are the details you provided:</p>

    <b>Name:</b> ${firstName} ${lastName}<br>
    <b>Phone Number:</b> ${phoneNumber}<br>
    <b>Email:</b> ${email}<br>
    <b>Message:</b> ${message? message: ''}<br><br>
    
    <p>We appreciate your interest in our [company/product/service]. Rest assured, your inquiry is important to us, and we will do our best to address it promptly.</p>

    <p>If you have any further questions or concerns, feel free to reply to below contact details</p>
    
    <p>Best regards,</p>

    Dagna.De<br>
    Email: info@dagna.de<br>`

    //Send email to the User
    await sendEmail(email, userSubject, userMessage);    

  return savedContact;
};

// Get the contact
const getSignleAndAllContact = async (contactId) => {
  if (contactId) {
    if (!isValidObjectId(contactId)) {
      throw new apiError(400, "Invalid contactId format");
    }
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new apiError(404, "Contact Not Found");
    }
    return contact;
  } else {
    const getAllContact = await Contact.find({});
    return getAllContact;
  }
};

// Delete the contact

const deleteContact = async (contactId) => {
  if (!isValidObjectId(contactId)) {
    throw new apiError(400, "Invalid contactId format");
  }
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  if (!deletedContact) {
    throw new apiError(404, "Contact Not Found");
  }
  return deletedContact;
};

export default {
  createContact,
  getSignleAndAllContact,
  deleteContact,
};
