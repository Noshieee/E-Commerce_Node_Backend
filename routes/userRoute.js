const express = require('express');
const User = require('../models/userModel')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUser } = require('../middleware/finders')

// GET all users
router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  
// GET one user
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

// REGISTER user
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
  
// UPDATE a user
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
    res.status(201).send(updatedUser);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

// DELETE a user
router.delete('/:id', getUser, async (req, res, next) => {
try {
    await res.user.remove();
    res.json({ message: "Deleted user" });
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

module.exports = router;