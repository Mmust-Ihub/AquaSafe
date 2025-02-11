import nodemailer from "nodemailer";
const sendEmail = async () => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail", // Change to your email provider (e.g., "outlook", "yahoo")
        auth: {
          user: process.env.EMAIL_USER, // Your email address
          pass: process.env.EMAIL_PASS, // Your email app password
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "josphinegatwiri34@gmail.com", // Africa’s Talking Support Email
        subject: "Request to Remove Blacklisted Number",
        html: `
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
          <h2 style="color: #d9534f;">🚨 Fish Cage Alert - Lake Victoria 🚨</h2>
          <div style="background-color: #ffdddd; padding: 20px; border: 2px solid red; border-radius: 10px; width: 60%; margin: auto; box-shadow: 0px 0px 10px rgba(255, 0, 0, 0.5);">
            <h3 style="color: #a94442;">⚠️ Abnormal Activity Detected! ⚠️</h3>
            <p><strong>Location:</strong> Fish Cage #12, Zone B</p>
            <p><strong>Issue:</strong> Sudden Drop in Oxygen Levels</p>
            <p><strong>Detected On:</strong> 11th Feb 2025, 10:45 AM</p>
            <p style="font-size: 18px;">Immediate action is required to prevent fish loss!</p>
          </div>
        </div>
      `,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  export default sendEmail;