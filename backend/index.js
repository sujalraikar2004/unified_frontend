
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');




const app = express();

app.use(cors());
app.use(bodyParser.json());

 const connectdb= async()=>{
   await mongoose
  .connect('mongodb+srv://sujalraikar84:sujal2004@cluster0.icxba.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

 }
 connectdb();

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


const User = mongoose.model('User', userSchema);

// Routes


app.post('/signup', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

 
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

  
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    
   

    res.status(200).json({
      message: 'Login successful',
      
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
let otpStore = {}; 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  port:4500,

  auth: {
    user: 'sujalraikar84@gmail.com', 
    pass: 'vmbbwdooxnhbrxtj',  
  },
  tls: {
    rejectUnauthorized: false         
  },
});


app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = otp;

   
    const mailOptions = {
      from: 'sujalraikar84@gmail.com',  
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to send OTP' });
      }
      res.status(200).json({ message: 'OTP sent to your email' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

  
    if (otpStore[email] !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    
    delete otpStore[email];

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
