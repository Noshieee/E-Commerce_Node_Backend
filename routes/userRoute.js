const express = require('express');
const User = require('../models/userModel')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUser } = require('../middleware/finders')
const nodemailer = require('nodemailer')

// GET all users (works)
router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  
// GET one user (works)
router.get('/:id', getUser, (req, res, next) => {
res.send(res.user);
});

// SIGN-IN user with email & password
router.patch("/", async (req, res, next) => {
const { email, password } = req.body;
const user = await User.findOne({ email });

if (!user) res.status(404).json({ message: "Could not find user" });
if (await bcrypt.compare(password, user.password)) {
    try {
    const access_token = jwt.sign(
        JSON.stringify(user),
        process.env.JWT_TOKEN_SECRET
    );
    res.status(201).json({ jwt: access_token });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
} else {
    res.status(400).json({ message: "Email and password combination do not match" });
}
});

// REGISTER user (works)
router.post("/", async (req, res, next) => {
const { name, email, contact, password } = req.body;

const salt = await bcrypt.genSalt();
const hashedPassword = await bcrypt.hash(password, salt);

const user = new User({
    name,
    email,
    contact,
    password: hashedPassword,
});

try {
    const newUser = await user.save();
    const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

const mailOptions = {
  from: 'enoshelliott14@gmail.com',
  to: email,
  subject: 'Signup Successful!',
  text: `Thank you ${name}, your Signup was successful. `
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

    try {
    const access_token = jwt.sign(
        JSON.stringify(newUser),
        process.env.JWT_TOKEN_SECRET
    );
    res.status(201).json({ jwt: access_token });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
} catch (error) {
    res.status(400).json({ message: error.message });
}
});
  
// UPDATE a user (works)
router.put("/:id", getUser, async (req, res, next) => {
const { name, contact, password, role } = req.body;
if (name) res.user.name = name;
if (contact) res.user.contact = contact;
if (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    res.user.password = hashedPassword;
}
if (role) res.user.role = role;

try {
    const updatedUser = await res.user.save();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });
    
    const mailOptions = {
      from: 'enoshelliott14@gmail.com',
      to: res.user.email,
      subject: 'Updated your account Successfully!',
      text: `Thank you ${res.user.name}, we have updated your account successfully. `
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
  })
    res.status(201).send(updatedUser);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

// DELETE a user
router.delete('/:id', getUser, async (req, res) => {
    const { name, email } = res.user
try {
    await res.user.remove();

    const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

const mailOptions = {
  from: 'enoshelliott14@gmail.com',
  to: email,
  subject: 'Removed account Successfully!',
  text: `Your account has been removed succesfully, thank you ${name} for your loyalty thus far.`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

    res.json({ message: "Deleted user" });
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

module.exports = router;