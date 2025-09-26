const mongoose = require('mongoose')

const addonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly', 'one-time'],
      default: 'one-time',
    },
    type: {
      type: String,
      enum: ['antivirus', 'backup', 'other'],
      default: 'other',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Addon', addonSchema)
