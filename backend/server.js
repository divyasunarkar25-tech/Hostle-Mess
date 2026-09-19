require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
// Serve local image uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const menuRoutes = require('./routes/menuRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/nutrition', nutritionRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Food Mess Management API is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
