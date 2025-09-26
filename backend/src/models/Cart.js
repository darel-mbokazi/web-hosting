const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ['domain', 'hosting', 'wordpress', 'addon'],
      required: true,
    },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String, 
    price: Number,
    registrationPeriod: Number, 
    billingCycle: String, 
  },
  { _id: false }
)

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [cartItemSchema],
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Cart', cartSchema)
