const express = require('express');
const connectDB = require('./db/connection');
const authRoutes = require('./routes/authRoute');
const adminRoutes = require('./routes/adminRoute');
const userRoutes = require('./routes/userRoute');
const jobRoutes = require('/routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoute');

require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/application', applicationRoutes);


connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
