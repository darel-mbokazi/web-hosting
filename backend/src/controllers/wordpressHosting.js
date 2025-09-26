const WordpressHosting = require("../models/WordpressHosting")

async function wordpressPlans(req, res) {
  const plans = await WordpressHosting.find()
  res.json(plans)
}

module.exports = { wordpressPlans }
