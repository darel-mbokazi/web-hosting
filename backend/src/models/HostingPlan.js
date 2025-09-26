const mongoose = require('mongoose')

const hostingPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    resources: {
      storage: String, 
      bandwidth: String, 
      databases: Number,
      websitesAllowed: Number,
      emailAccounts: Number,
      sslIncluded: { type: String, default: 'Free' },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('HostingPlan', hostingPlanSchema)
