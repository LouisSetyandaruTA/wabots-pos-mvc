const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Username tidak ditemukan"
      });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Password salah"
      });
    }

    const token = jwt.sign(
      { id: admin.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};