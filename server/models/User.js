const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required: function() {
            return !this.googleId && !this.facebookId && !this.twitterId && !this.githubId; // Password is required only if no social ID is present
        }
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true, // Allows for unique constraint on googleId only if it exists
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false,
    },

}, {timestamps:true, }
);
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false; // If no password, cannot match
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password field exists and is modified
    if (this.isModified('password') && this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;