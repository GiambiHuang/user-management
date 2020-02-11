const express = require('express');
const gravatar = require('gravatar');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();
/**
 * @method  GET
 * @path    /api/user
 * @param
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (error) {
    return res.status(500).send('error');
  }
});

/**
 * @method  POST
 * @path    /api/user
 * @param   fullname: String
 * @param   email: String
 * @param   password: String
 */
router.post(
  '/',
  [
    check('fullname', 'Required')
      .not()
      .isEmpty(),
    check('email', 'Required').isEmail(),
    check('password', 'Required').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { fullname, email, password } = req.body;
    try {
      // check if the email has been registered
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ success: false, errors: [{ msg: 'User already exists' }] });
      }
      const salt = await bcryptjs.genSalt(10);
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
      user = new User({
        fullname,
        email,
        avatar,
        password
      });

      user.password = await bcryptjs.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          return res.json({
            success: true,
            message: 'User registered',
            token
          });
        }
      );
    } catch (err) {
      res.json({
        success: false,
        message: err.message
      });
    }
  }
);

module.exports = router;
