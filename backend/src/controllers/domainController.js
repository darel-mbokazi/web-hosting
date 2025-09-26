const domainService = require('../services/domainService')

// Search WHOIS
async function search(req, res) {
  try {
    const { domainName } = req.body
    if (!domainName) {
      return res.status(400).json({ error: 'Domain name is required' })
    }

    const result = await domainService.searchDomain(domainName)
    res.json(result)
  } catch (err) {
    // Unsupported extension 
    if (
      err.message.includes('not supported') ||
      err.message.includes('already registered')
    ) {
      return res.status(400).json({ error: err.message })
    }

    res
      .status(500)
      .json({ error: 'Internal server error', details: err.message })
  }
}

// Register new domain and add it to cart
async function register(req, res) {
  try {
    const { domainName } = req.body
    if (!domainName) {
      return res.status(400).json({ error: 'Domain name is required' })
    }

    const userId = req.user._id

    // register & push to cart
    const { domain, cart } = await domainService.registerDomain({
      name: domainName,
      userId,
    })

    res.status(201).json({
      message: `Domain "${domain.name}" registered and added to cart successfully`,
      domain,
      cart,
    })
  } catch (err) {
    if (
      err.message.includes('not supported') ||
      err.message.includes('already registered')
    ) {
      return res.status(400).json({ error: err.message })
    }

    res
      .status(500)
      .json({ error: 'Internal server error', details: err.message })
  }
}

module.exports = {
  search,
  register,
}
