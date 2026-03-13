require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const patientsRoutes = require('./routes/patientsRoutes');
const therapistsRoutes = require('./routes/therapistsRoutes');
const sessionsRoutes = require('./routes/sessionsRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const consentRoutes = require('./routes/consentRoutes');

const app = express();

/* ------------------- CORS CONFIG ------------------- */
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

/* ------------------- MIDDLEWARE ------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

/* ------------------- MONGODB CONNECTION ------------------- */
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/speech')
.then(() => {
  console.log('MongoDB Connected Successfully');
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

/* ------------------- ROUTES ------------------- */
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/therapists', therapistsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/consent', consentRoutes);

/* ------------------- BASIC ROUTE ------------------- */
app.get('/', (req, res) => {
  res.send('API is running...');
});

/* ------------------- 404 HANDLER ------------------- */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ------------------- SERVER START ------------------- */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});