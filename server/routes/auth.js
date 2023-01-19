const { Router } = require('express');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const generateTokens = require('../utils/generateTokens');
const {
  signUpBodyValidation,
  logInBodyValidation,
} = require('../utils/validationSchema');

const router = Router();

// signup
router.post('/signUp', async (req, res) => {
  try {
    const { error } = signUpBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .json({ error: true, message: 'User with given email already exist' });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();

    res.status(201).json({
      error: false,
      message: 'Account created sucessfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

// login
router.post('/logIn', async (req, res) => {
  try {
    const { error } = logInBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: 'Invalid email or password' });

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!verifiedPassword)
      return res
        .status(401)
        .json({ error: true, message: 'Invalid email or password' });

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      user: { userName: user.userName, email: user.email },
      message: 'Logged in sucessfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

module.exports = router;
