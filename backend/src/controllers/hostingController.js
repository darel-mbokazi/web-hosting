const HostingPlan = require('../models/HostingPlan')

async function listPlans(req, res) {
  const plans = await HostingPlan.find()
  res.json(plans)
}

module.exports = { listPlans }
