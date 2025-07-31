const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, generateToken } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const passport = require('passport'); 

// Existing email/password routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Google OAuth Routes
// @desc    Auth with Google
// @route   GET /api/auth/google
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }) // request profile and email data
);

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }), // Redirect to login on failure
    (req, res) => {
        // Successful authentication, redirect to a frontend dashboard or send JWT
        // In a real application, you'd likely redirect to your frontend dashboard
        // and handle the session/JWT there.
        // For now, let's just log success or redirect to a simple success page.

        // If you want to send a JWT back to the client after social login:
        // You would typically generate a JWT here and send it.
        // For simplicity, Passport's session will manage the user for now.
        // We'll discuss how to convert this to JWT for SPA later.

        // Example: Redirect to a frontend dashboard (e.g., http://localhost:3000/dashboard)
        // You might append a token as a query parameter or set it in a cookie
        // if not using traditional sessions for authentication.
        // For session-based, Passport's session handles it.

        const token = generateToken(req.user._id);
        res.redirect(`http://localhost:5173/auth/success?token=${token}`); // Redirect to your frontend dashboard route
    }
);

// @desc    Logout user (for session-based Passport)
// @route   GET /api/auth/logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => { // Passport's logout method
        if (err) { return next(err); }
        req.session.destroy((err) => { // Destroy the session
            if (err) {
                console.error("Error destroying session:", err);
                return next(err);
            }
            res.clearCookie('connect.sid'); // Clear the session cookie (default name for express-session)
            res.redirect('http://localhost:5173/'); // Redirect to frontend homepage
        });
    });
});


module.exports = router;