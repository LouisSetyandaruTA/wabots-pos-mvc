// require('dotenv').config();
// const express = require('express');
// const app = express();
// const path = require('path');
// const session = require('express-session');
// const sequelize = require('./config/database');
// const Product = require('./models/Product');

// const PORT = process.env.PORT || 3000;

// // ======= Konfigurasi View Engine =======
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // ======= Middleware =======
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // ======= Session Middleware =======
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(session({
//   secret: 'your_secret_key',
//   resave: false,
//   saveUninitialized: false
// }));

// function isAuthenticated(req, res, next) {
//   if (req.session.adminId) {
//     next();
//   } else {
//     res.redirect('/login');
//   }
// }

// app.get('/dashboard', isAuthenticated, (req, res) => {
//   res.render('dashboard');
// });

// // ======= Routing =======
// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const productRoutes = require('./routes/productRoutes');
// const dashboardRoutes = require('./routes/dashboardRoutes');

// app.use(authRoutes);
// app.use('/', adminRoutes);
// app.use(dashboardRoutes); // hanya /dashboard
// app.use(productRoutes);

// // ======= Database Connection =======
// sequelize.authenticate()
//   .then(() => {
//     console.log('DB connected');
//     return sequelize.sync({ alter: true }); 
//     // return sequelize.sync(); 
//   })
//   .then(() => {
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.error('DB error', err);
//   });

require('dotenv').config(); 
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Middleware parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Static files & view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware auth
const authMiddleware = require('./middlewares/authMiddleware');
const redirectIfAuthenticated = require('./middlewares/redirectIfAuthenticated');

// Routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productRoutes = require('./routes/productRoutes');

// Default route (root)
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/login');
});

// Auth routes
app.use('/login', redirectIfAuthenticated, authRoutes);

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Protected routes
app.use('/dashboard', authMiddleware, dashboardRoutes);
app.use('/products', authMiddleware, productRoutes);

// 404 Fallback
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});