const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'admin', 'support'],
      default: 'customer',
    },
    phone: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    twoFactorEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
