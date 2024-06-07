import { validateEmail, validateObjectId } from "../helpers/helper.methods.js";
import Donation from "../models/donation.model.js";
import { apiError } from "../utils/apiError.js";
import { sendEmail } from "../utils/send.email.js";

// Donation Methods
const registerDonation = async (body) => {
    const { fullName, email, phoneNumber, donation } = body;
    if (!fullName || !email || !phoneNumber || !donation) {
      throw new apiError(400, "Missing Fields Are Required");
    }
  
    //If email address is not valid, throw error
    if (!validateEmail(email)) {
      throw new apiError(400, "Provide valid email address");
    }
  
    const newDonation = new Donation({
      fullName,
      email,
      phoneNumber,
      donation,
    });
  
    const savedDonation = await newDonation.save();
    if (!savedDonation) {
      throw new apiError(400, "Something Went Wrong at the time of data saving");
    }
  
    const subject = "New Donation Information";
  
    const donationInformation = `
    <p>Hello,</p>
  
    <p>You have received a new donation information from your website: </p>
  
    <b>Name:</b>${fullName}<br>
    <b>Email:</b>${email}<br>
    <b>Phone Number:</b>${phoneNumber}<br>
    <b>Donation:</b>€${donation}<br><br>
  
    <p>Regards,</p>
    Dagna.De`;
  
    // Send the email for new contact user
    // await sendEmail('info@dagna.de', subject, donationInformation);
    await sendEmail(email, subject, donationInformation);
  
    // Constructing the email message for Donner
    const donnerSubject = "Thank You for Your Generous Donation!";
    const donnerMessage = `<p>Dear ${fullName},</p>
    
      <p>On behalf of Dagna.De, I want to extend our heartfelt gratitude for your generous donation of €${donation}. Your support plays a crucial role in helping us continue our mission.</p>
      <p>We are truly grateful for your commitment to our cause and for believing in the work we do. Your support not only sustains our efforts but also inspires us to strive for greater achievements.</p>
      <p>Here are the details you provided us:</p>
  
      <b>Name:</b>${fullName}<br>
      <b>Email:</b>${email}<br>
      <b>Phone Number:</b>${phoneNumber}<br>
      <b>Donation:</b>€${donation}<br><br>

      <p>Once again, thank you for your kindness and generosity. We look forward to keeping you updated on the progress and impact of our initiatives, made possible by supporters like you.</p>
      
      <p>Warm regards,</p>
  
      Dagna.De<br>
      Email: info@dagna.de<br>`
  
      //Send email to the User
      await sendEmail(email, donnerSubject, donnerMessage);    
  
    return savedDonation;
  };

  const getDonationInfo = async (Id) => {
    if (Id) {
      validateObjectId(Id, "Invalid or missing Id");
      const findDonation = await Donation.findOne({_id: Id});
      if (!findDonation) {
        throw new apiError(404, "Donation Info Not Found");
      }
      return findDonation;
    } 
    
    const allDonationInfos = await Donation.find({});
    if (!allDonationInfos.length) {
      throw new apiError(404, "No Donation Info Found");
    }
    return allDonationInfos;
  };

  export default {
    registerDonation,    
    getDonationInfo,
  };