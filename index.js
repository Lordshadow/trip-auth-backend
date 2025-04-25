const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const nodemailer = require('nodemailer');

const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes'); 
const vehicleRoutes = require('./routes/vehicleRoutes');
const tempBookingRoutes = require('./routes/tempBookings'); 
const hotelRoutes = require('./routes/hotelRoutes');
const tempHotelBookingRoutes = require('./routes/tempHotelBookings');

const app = express();
const allowedOrigins = ['https://triptacktix.web.app', 'http://localhost:5173']; // Add your local port

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/profile',profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/temp-bookings', tempBookingRoutes); 
app.use('/api/hotels', hotelRoutes);
app.use('/api/temp-bookings', tempHotelBookingRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error(err));


app.get("/", (req, res) => {
  res.send("API is working ✅");
});


app.post('/contact', async (req, res) => {
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

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Email failed to send',
      error: error.message,
    });
  }
});






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
