require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/database');
const Product = require('./models/Product');

// ======= Konfigurasi View Engine =======
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ======= Middleware =======
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ======= Session Middleware =======
app.use(session({
  secret: 'rahasia_admin',
  resave: false,
  saveUninitialized: true,
}));

function isAuthenticated(req, res, next) {
  if (req.session.adminId) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard');
});

// ======= Routing =======
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use(dashboardRoutes); // hanya /dashboard
app.use(productRoutes);

// ======= Database Connection =======
sequelize.authenticate()
  .then(() => {
    console.log('DB connected');
    return sequelize.sync({ alter: true }); // hanya saat pengembangan
    // return sequelize.sync(); 
  })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB error', err);
  });