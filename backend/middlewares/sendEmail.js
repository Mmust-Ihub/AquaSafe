import nodemailer from "nodemailer";

const sendEmail = async (email,data) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "🚨 Fish Cage Movement Alert 🚨",
            html: `
            <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
                <h2 style="color: #d9534f;">⚠️ Urgent Alert: Your Fish Cage is Moving! ⚠️</h2>
                <div style="background-color: #fffae6; padding: 20px; border: 2px solid #ffcc00; border-radius: 10px; width: 60%; margin: auto; box-shadow: 0px 0px 10px rgba(255, 204, 0, 0.5);">
                    <h3 style="color: #ff8800;">⛵ Automatic Relocation in Progress ⛵</h3>
                    <p><strong>Fish Cage ID:</strong> ${data.id}</p>
                    <p><strong>Current Location:</strong>
                      <ul>
                        <li>Latitude: ${data.location.latitude}</li>
                      <li>Longitude ${data.location.longitude}</li>
                      </ul>
                    
                    </p>
                    <p><strong>New Destination:</strong> ${data.destination}</p>
                    <p><strong>Water Temperature:</strong> ${data.temp}°C</p>
                    <p><strong>Nitrogen Levels:</strong> ${data.nitrogen} mg/L</p>
                    <p><strong>Phosphorus Levels:</strong> ${data.phosphorus} mg/L</p>
                    <p><strong>Oxygen Levels:</strong> ${data.oxygen} mg/L</p>
                    <p style="font-size: 18px; color: #ff8800;"><strong>🔄 Action:</strong> The cage is automatically relocating to a safer area.</p>
                </div>
                <p style="font-size: 16px;">🚀 You will be alerted once the cage reaches its new location.</p>
            </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendEmail;
