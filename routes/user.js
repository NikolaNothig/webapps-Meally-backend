const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

router.post("/register", async (req, res) => {
  let emailExists = await User.findOne({ email: req.body.email });
  let usernameExists = await User.findOne({ username: req.body.username });

  if (!(emailExists || usernameExists)) {
    let user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;

    await user.save();
    return res.status(200).json({ message: "Registration successful" });
  } else {
    return res.status(406).json({ message: "Email or username already exists" });
  }
});

router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  if (req.body.password == user.password) {
    user.loginToken = uuidv4();

    await user.save();

    return res
      .cookie("loginToken", user.loginToken, { sameSite: "none", secure: true })
      .cookie("userId", user._id, { sameSite: "none", secure: true })
      .cookie("email", user.email, { sameSite: "none", secure: true })
      .cookie("username", user.username, { sameSite: "none", secure: true })
      .status(200)
      .json({
        message: "OK",
        cookies: {
          user_id: user._id,
          loginToken: user.loginToken,
          email: user.email,
          username: user.username,
        },
      });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/check", async (req, res) => {
  const token = req.cookies.loginToken;
  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }
  
  const user = await User.findOne({ loginToken: token });
  if (!user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  return res.status(200).json({ message: "Logged in" });
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id/recipes', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('createdRecipes');
    res.status(200).json(user.createdRecipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
