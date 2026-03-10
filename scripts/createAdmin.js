const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Admin = sequelize.define('Admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'admins',
  timestamps: false 
});

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await Admin.create({
      username: 'admin',
      password: hashedPassword
    });

    console.log('✅ Admin berhasil dibuat:', admin.username);
  } catch (err) {
    console.error('❌ Gagal membuat admin:', err.message);
  } finally {
    await sequelize.close();
  }
}

createAdmin();