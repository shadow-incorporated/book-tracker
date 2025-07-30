const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Your existing User model
const dotenv = require('dotenv');

dotenv.config(); // Ensure dotenv is loaded here too, or trust server.js to load it globally

// Passport serialization/deserialization for session management
// This is crucial for keeping user logged in across requests
passport.serializeUser((user, done) => {
    done(null, user.id); // Store user ID in session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Retrieve user from DB using ID stored in session
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback', // This must match the Authorized redirect URI in Google Console
        },
        async (accessToken, refreshToken, profile, done) => {
            // This function is called after Google authenticates the user
            const newUser = {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value, // Google guarantees at least one email
            };

            try {
                // Try to find a user by their Google ID first
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // If user already exists, return them
                    done(null, user);
                } else {
                    // If no user found by googleId, check if a user with this email already exists
                    // This handles cases where a user might register with email/password
                    // and then later tries to link/login with Google.
                    let existingUserByEmail = await User.findOne({ email: profile.emails[0].value });

                    if (existingUserByEmail) {
                        // User exists by email, link Google ID to their existing account
                        existingUserByEmail.googleId = profile.id;
                        await existingUserByEmail.save();
                        user = existingUserByEmail; // Use the updated user
                    } else {
                        // Create a brand new user if no existing user found by googleId or email
                        user = await User.create(newUser);
                    }
                    done(null, user); // Return the found/created/updated user
                }
            } catch (err) {
                console.error(err);
                done(err, null); // Pass error to Passport
            }
        }
    )
);

module.exports = passport; // Export passport instance