const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const nodemailer = require('nodemailer');

const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes'); 

const app = express();
app.use(cors(
  {
    origin: 'https://triptacktix.web.app',
    credentials: true
  }
));
app.use(express.json());

app.use('/api/profile',profileRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error(err));


app.get("/", (req, res) => {
  res.send("API is working ✅");
});


app.post('https://trip-planner-backend-isxb.onrender.com/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    });

    res.status(200).send('Email sent successfully');
  } catch (error) {
    res.status(500).send('Email failed to send');
  }
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
