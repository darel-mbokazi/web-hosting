const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'support'], default: 'user' },
  message: String,
  createdAt: { type: Date, default: Date.now },
})

const ticketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['open', 'closed', 'pending'],
      default: 'open',
    },
    subject: String,
    department: {
      type: String,
      enum: ['general', 'account', 'sales', 'support'],
      default: 'general',
    },
    messages: [messageSchema],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Ticket', ticketSchema)
