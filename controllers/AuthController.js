const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const session = require('express-session');

exports.loginForm = (req, res) => {
  res.render('login', { error: null });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.render('login', { error: 'Username tidak ditemukan' });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.render('login', { error: 'Password salah' });
    }

    req.session.adminId = admin.id;
    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Terjadi kesalahan server' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};