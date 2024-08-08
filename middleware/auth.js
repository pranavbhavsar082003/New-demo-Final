module.exports.isAuthenticated = (req, res, next) => {
  console.log('Checking authentication...');
  if (req.isAuthenticated()) {
    console.log('User is authenticated');
    return next();
  }
  console.log('User is not authenticated');
  req.session.redirectTo = req.originalUrl;
  res.redirect('/auth/login');
};
