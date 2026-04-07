const Customer = require('../models/Customer');
const sequelize = require('../config/database');
require('../models/associations');

async function createDummyCustomers() {
  try {
    await sequelize.sync();

    await Customer.bulkCreate([
      { name: 'Budi Santoso', phoneNumber: '081234567890' },
      { name: 'Siti Aminah', phoneNumber: '089876543210' },
      { name: 'John Doe', phoneNumber: '082233445566' }
    ]);

    console.log('Dummy customers created.');
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createDummyCustomers();