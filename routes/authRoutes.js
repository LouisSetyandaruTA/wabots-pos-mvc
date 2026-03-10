const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const Admin = require('../models/Admin');


router.get('/', (req, res) => {
  res.render('login', { error: null });
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.render('login', { error: 'Username atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.render('login', { error: 'Username atau password salah' });
    }

    req.session.userId = admin.id;
    return res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    return res.render('login', { error: 'Terjadi kesalahan saat login' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;