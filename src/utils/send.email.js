import nodemailer from "nodemailer";

const sendEmail = (email, subject, data) => {
  try { 
    const transporter = nodemailer.createTransport({
      host: process.env.IONOS_EMAIL_HOST, // IONOS SMTP server
      port: process.env.IONOS_EMAIL_PORT, // SMTP port (usually 587 for STARTTLS)
      secure: true, // True for 465, false for other ports (STARTTLS)
      auth: {
        user: process.env.IONOS_EMAIL_USER, // Your IONOS email address
        pass: process.env.IONOS_EMAIL_PASS  // Your IONOS email password
       },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      },
        
    });

    transporter.verify((error, success) => {
      if (error) {
          console.log('Server connection error:', error);
      }
    });

    const mailOptions = () => {
      return {
        from: process.env.IONOS_EMAIL_USER,
        to: email,
        subject: subject,
        html: data,
      };      
    };
    // Send email
    transporter.sendMail(mailOptions(), (error, info) => {
      if (error) {
        return console.log("Error occurred: ", error.message);        
      }       
    });
  } catch (error) {
    return error;
  }
};

export { sendEmail };
