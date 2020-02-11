const express = require('express');
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const validation = require('../middleware/validation');
const Profile = require('../models/Profile');
const router = express.Router();

/**
 * @method  GET
 * @path    /api/profile/me
 * @desc    Get current user profile
 */
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['fullname', 'email']);

    if (!profile) {
      return res.status(400).json({ message: 'There is no profile' });
    }
    return res.json(profile);
  } catch (error) {
    return res.json({ message: error.message });
  }
});

/**
 * @method  POST
 * @path    /api/profile
 * @desc    Create/Update current user profile
 * @params  [social, experiences]
 */
router.post(
  '/',
  [
    auth,
    [
      check('social', 'Social is required')
        .not()
        .isEmpty(),
      check('experiences', 'Experiences is required')
        .not()
        .isEmpty()
    ],
    validation
  ],
  async (req, res) => {
    const {
      body,
      user: { id }
    } = req;
    const { social, experiences } = body;
    const profileFields = {
      user: id,
      social,
      experiences
    };

    try {
      let profile = await Profile.findOne({ user: id });

      if (!profile) {
        profile = await Profile.findOneAndUpdate(
          { user: id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
      // return res.json(profile);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

/**
 * @method  GET
 * @path    /api/profile
 * @desc    Get all profiles
 */
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.find().populate('user', [
      'fullname',
      'email'
    ]);

    if (!profile) {
      return res.status(400).json({ message: 'There is no profile' });
    }
    return res.json(profile);
  } catch (error) {
    return res.json({ message: error.message });
  }
});

/**
 * @method  GET
 * @path    /api/profile/user/user_id
 * @desc    Get all profiles
 */
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['fullname', 'email']);

    if (!profile) {
      return res.status(400).json({ message: 'There is no profile' });
    }
    return res.json(profile);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ message: 'There is no profile' });
    }
    return res.json({ message: error.message });
  }
});

module.exports = router;
