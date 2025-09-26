const mongoose = require('mongoose')

const domainSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, 
    price: { type: Number, default: 100.00 },
    status: {
      type: String,
      enum: ['available', 'registered', 'expired', 'pending'],
      default: 'available',
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expiryDate: Date,
    autoRenew: { type: Boolean, default: false },
    registrationPeriod: { type: Number, default: 1 }, // expire after 1 year 
  },
  { timestamps: true }
)

module.exports = mongoose.model('Domain', domainSchema)
