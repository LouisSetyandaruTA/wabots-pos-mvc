// function isAuthenticated(req, res, next) {
//   if (req.session && req.session.userId) {
//     return next();
//   }
//   res.redirect('/login');
// }

// module.exports = isAuthenticated;

module.exports = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  next();
};