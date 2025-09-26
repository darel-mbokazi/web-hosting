const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ['domain', 'hosting', 'wordpress', 'addon'],
      required: true,
    },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String,
    price: Number,
    billingCycle: String,
    registrationPeriod: Number,
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
