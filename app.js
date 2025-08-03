require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3000;

// Use express's built-in middleware to parse JSON
app.use(express.json());

app.post("/sentEmail", async (req, res) => {
  console.log(req.body, "req.body"); // Log the body to see its content
  const { to, name, text } = req.body;
  if (!to || !name) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  let transporter = nodemailer.createTransport({
    service: "gmail", // or any other service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // HTML template for the email
  const htmlTemplate2 = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;"></h2>
      <p>${text}</p>
      <p>Best regards,</p>
      <p>Your Company Name</p>
    </div>
  `;
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Birthday Wishes from Mallabhum Prayas</title>
    <style>

        /* Responsive font size */
        @media (max-width: 600px) {
            .mallabhum, .prayas {
                font-size: 15px
            }
        }

        @media (min-width: 601px) {
            .mallabhum, .prayas {
                font-size: 30px
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #e2dcdc;">
    <table align="center" width="100%" style="margin: 0; padding: 20px 0; background-color: #f4f4f4;">
        <tr>
            <td>
                <table align="center" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                    <!-- Header with Logo and Text on the Same Line -->
                    <tr>
                        <td style="background-color: #a19b9b; color: #ffffff; text-align: left; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <table style="width: 100%; display: table; table-layout: fixed;">
                                <tr>
                                    <td style="width: 50px; vertical-align: middle;">
                                        <img src="https://mallabhumprayas.org/assets/img/mlogo/mlogo.png" alt="Mallabhum Prayas Logo" style="max-width: 50px; height: 50px; border-radius: 50%;" />
                                    </td>
                                    <td style="vertical-align: middle; padding-left: 15px;">
                                        <div style="display: flex; align-items: center;">
                                            <div class="mallabhum"    style="display: inline; background-color: #FFD700; color: black; padding: 5px 10px;  font-weight: bold;">
                                                Mallabhum
                                            </div>
                                            <div class="prayas"  style="display: inline; background-color: #2D662F; color: #FFFFFF; padding: 5px 10px;  font-weight: bold;">
                                                Prayas
                                            </div>
                                        </div>
                                        <p style="margin: 0; font-size: 16px; padding-top: 4px;">মানুষের সাথে মানুষের পাশে</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px; text-align: left; color: #333;">
                            <h1 style="margin: 0; font-size: 28px;">Happy Birthday!</h1>
                            <p style="margin: 20px 0; font-size: 16px;">Dear ${name},</p>
                            <p style="margin: 20px 0; font-size: 16px; line-height: 1.5;">
                                On this special day, we at Mallabhum Prayas want to take a moment to celebrate you!
                                Your selfless act of donating blood has made a significant impact on the lives of many.
                            </p>
                            <p style="margin: 20px 0; font-size: 16px; line-height: 1.5;">
                                We are grateful for your generosity and commitment to saving lives. May this year bring
                                you joy, health, and happiness.
                            </p>
                            <p style="margin: 20px 0; font-size: 16px;">Thank you for being a hero!</p>
                            <p style="margin: 20px 0; font-size: 16px;">
                                Warm wishes,<br>
                                The Mallabhum Prayas Team
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f4f4f4; text-align: center; padding: 10px; font-size: 12px; color: #777;">
                            &copy; 2024 <a href="https://mallabhumprayas.org/" style="color: #777; text-decoration: none;">Mallabhum Prayas</a>. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Happy Birthday, ${name}!`,
    html: htmlTemplate,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    res.send({ message: "Email sent", id: info.messageId });
  } catch (err) {
    res.status(500).send({ error: "Email failed to send", details: err });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
