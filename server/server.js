const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const cors = require('cors');
const passport = require('passport'); // <--- ADD THIS
const session = require('express-session'); // <--- ADD THIS
const cookieParser = require('cookie-parser'); // <--- ADD THIS

// Load passport config
require('./config/passport'); // <--- ADD THIS (no variable needed, just runs the config file)

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Allow your frontend origin
    credentials: true // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded data
app.use(cookieParser()); // <--- ADD THIS

// Express Session Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Use a strong, random string from your .env
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't create session until something stored
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
            // secure: process.env.NODE_ENV === 'production' // Set to true in production with HTTPS
            httpOnly: true // Prevents client-side JS from reading the cookie
        }
    })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions (requires express-session)


// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});