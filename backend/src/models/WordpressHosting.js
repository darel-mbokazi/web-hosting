const mongoose = require('mongoose')

const wordpressHostingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    resources: {
      storage: String,
      databases: Number,
      websitesAllowed: Number,
      emailAccounts: Number,
      sslIncluded: { type: String, default: 'Free' },
      dailyBackups: { type: String, default: 'Free' },
      controlPanel: { type: String, default: 'Direct Admin' },
      siteBuilder: { type: String, default: 'Free' },
      bandwidth: { type: String, default: 'Unlimited' },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('WordpressHosting', wordpressHostingSchema)
