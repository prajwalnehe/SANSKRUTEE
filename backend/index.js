import { configDotenv } from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport, { setupPassport } from './config/passport.js';

import authRoutes from './routes/auth.routes.js';
import headerRoutes from './routes/header.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import addressRoutes from './routes/address.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import adminRoutes from './routes/admin.routes.js';

import connectDB from './config/DataBaseConnection.js';
import cookieJwtAuth from './middleware/authMiddleware.js';

configDotenv();       

console.log('Razorpay env loaded:', Boolean(process.env.RAZORPAY_KEY_ID), Boolean(process.env.RAZORPAY_KEY_SECRET));

const server = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// Needed when running behind a proxy (Render) to correctly set secure cookies
server.set('trust proxy', 1);
server.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

server.use(express.json());
server.use(cookieParser());

// Initialize Passport strategies
setupPassport();
server.use(passport.initialize());

server.get('/api/health', (req, res) => res.json({ ok: true }));
// Cookie-JWT protected current user info (Google/local unified)
server.get('/api/me', cookieJwtAuth, (req, res) => {
  const user = req.user;
  res.json({ user });
});

server.use('/api/auth', authRoutes);
server.use('/api/header', headerRoutes);
server.use('/api/products', productRoutes);
server.use('/api/cart', cartRoutes);
server.use('/api/payment', paymentRoutes);
server.use('/api/address', addressRoutes);
server.use('/api/orders', ordersRoutes);
server.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 7000;

await connectDB(process.env.MONGODB_URI || '');

server.listen(PORT, () => {
  console.log('Server is running at', PORT);
});