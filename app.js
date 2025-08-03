require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Use express's built-in middleware to parse JSON
app.use(express.json());

app.post('/sentemail', async (req, res) => {
  console.log(req.body,'req.body'); // Log the body to see its content
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail', // or any other service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    res.send({ message: 'Email sent', id: info.messageId });
  } catch (err) {
    res.status(500).send({ error: 'Email failed to send', details: err });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
