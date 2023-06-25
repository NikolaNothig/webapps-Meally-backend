const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

router.post('/register', async (req, res) => {
  let emailExists = await User.findOne({ email: req.body.email });
  if (!emailExists) {
    try {
      let newUser = new User();
      newUser.username = req.body.username;
      newUser.email = req.body.email;
      newUser.password = req.body.password; 

      await newUser.save();
      
      res.cookie('userId', newUser._id.toString(), { httpOnly: false, secure: true, sameSite: 'strict' });

      res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    return res.status(406).json({ message: 'Email already exists' });
  }
});

router.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    if (req.body.password == user.password) { 
      user.loginToken = uuidv4();

      await user.save();

      return res
        .cookie("loginToken", user.loginToken, { sameSite: "none", secure: true })
        .cookie("username", user.username, { sameSite: "none", secure: true })
        .cookie("userId", user._id.toString(), { sameSite: "none", secure: true }) 
        .status(200)
        .json({
          message: "OK",
          cookies: {
            loginToken: user.loginToken,
            username: user.username,
            userId: user._id.toString()  
          },
        });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
