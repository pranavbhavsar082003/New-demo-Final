const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Show registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.render('register', { message: 'Passwords do not match.' });
    }
    const user = new User({ username, email });
    await User.register(user, password);
    res.redirect('/auth/login');
  } catch (err) {
    res.render('register', { message: 'Registration failed. Please try again.' });
  }
});

// Show login form
router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

// Handle login
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login',
  failureFlash: true
}), (req, res) => {
  const redirectTo = req.session.redirectTo ? req.session.redirectTo : '/nfts';
  delete req.session.redirectTo;
  res.redirect(redirectTo);
});

// GitHub Authentication
router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('/nfts');
  });

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
