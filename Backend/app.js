const express = require('express');
const connectDB = require('./db/connection');
const authRoutes = require('./routes/authRoute');
const adminRoutes = require('./routes/adminRoute');
const userRoutes = require('./routes/userRoute');
const jobRoutes = require('./routes/jobRoute');
const applicationRoutes = require('./routes/applicationRoute');
const notificationRoutes = require('./routes/notificationRoute');
const http = require('node:http');
const {Server} = require('socket.io');
const cors = require('cors');
const multer = require('multer');

require('dotenv').config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors :'*'
});

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);


// upload error handler
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message.includes('Invalid') || err.message.includes('allowed')) {
        return res.status(400).json({ status: 'fail', message: err.message });
    }
    next(err);
});


connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
