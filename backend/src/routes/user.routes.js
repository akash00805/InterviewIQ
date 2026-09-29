const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/me', protect, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, preferredRole, targetCompanies } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName: firstName || req.user.firstName,
        lastName: lastName || req.user.lastName,
        phoneNumber: phoneNumber || req.user.phoneNumber,
        preferredRole: preferredRole || req.user.preferredRole,
        targetCompanies: targetCompanies || req.user.targetCompanies
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('❌ Save interview error:', error.message)
    res.status(500).json({ error: 'Error saving interview result', details: error.message })
  }
});

// Save interview result
router.post('/interview-result', protect, async (req, res) => {
  try {
    const { category, score } = req.body

    const user = await User.findById(req.user.id)

    user.interviewStats.totalInterviews += 1
    user.interviewStats.totalScore += score
    user.interviewStats.averageScore = Math.round(
      user.interviewStats.totalScore / user.interviewStats.totalInterviews
    )

    user.interviewStats.recentInterviews.unshift({
  category,
  score,
  date: new Date(),
  questions: questions || []
})

    if (user.interviewStats.recentInterviews.length > 10) {
      user.interviewStats.recentInterviews = user.interviewStats.recentInterviews.slice(0, 10)
    }

    await user.save()
    res.json({ message: 'Interview result saved', stats: user.interviewStats })
  } catch (error) {
    res.status(500).json({ error: 'Error saving interview result' })
  }
})

// Get single interview result
router.get('/interview-result/:index', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const index = parseInt(req.params.index)
    const interview = user.interviewStats.recentInterviews[index]
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' })
    }
    res.json(interview)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching interview result' })
  }
})

module.exports = router;
