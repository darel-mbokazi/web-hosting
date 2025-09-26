const AddonPlan = require('../models/Addon')

async function listAddonPlans(req, res) {
    const plans = await AddonPlan.find()
    res.json(plans)
}

module.exports = { listAddonPlans }