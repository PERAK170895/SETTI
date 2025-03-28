const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const User = require('./User');
const fs = require('fs');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'secret123';

// Middleware
app.use(express.json());
app.use(cors());

// Pastikan folder uploads ada
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Setup Multer untuk menyimpan file di folder uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Menyimpan file di folder 'uploads'
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Memberikan nama file berdasarkan timestamp
    }
});

// Buat upload middleware
const upload = multer({ storage: storage });

// Koneksi ke MongoDB Atlas
mongoose.connect('mongodb+srv://dirgazai:Peranikasps1@murahan123.gzqjncq.mongodb.net/?retryWrites=true&w=majority&appName=murahan123')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Register User
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Email already exists' });
    }
});

// Login User
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Upload Foto
app.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Mengirimkan respons setelah foto berhasil di-upload
    res.json({ message: 'File uploaded successfully', file: req.file });
});

// Protected Route Example
app.get('/dashboard', (req, res) => {
    res.send('Welcome to the dashboard!');
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
