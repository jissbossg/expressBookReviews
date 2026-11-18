const express = require('express');
const session = require('express-session');
const customerRoutes = require('./router/auth_users').authenticated;
const generalRoutes = require('./router/general').general;
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(express.json());

app.use(
  session({
    secret: 'fingerprint_customer',
    resave: true,
    saveUninitialized: true
  })
);

// Protege todas las rutas /customer/auth/*
app.use('/customer/auth/*', authMiddleware);

app.use('/customer', customerRoutes);
app.use('/', generalRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));