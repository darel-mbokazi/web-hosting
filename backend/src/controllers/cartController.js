const cartService = require('../services/cartService')

async function getCart(req, res) {
  const cart = await cartService.getCart(req.user._id)
  res.json(cart)
}

async function addHosting(req, res) {
  try {
    const { hostingId } = req.body
    const cart = await cartService.addHostingToCart(req.user._id, hostingId)
    res.json(cart)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function addWordpress(req, res) {
  try {
    const { wordpressId } = req.body
    const cart = await cartService.addWordpressToCart(req.user._id, wordpressId)
    res.json(cart)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function addAddon(req, res) {
  try {
    const { addonId } = req.body
    const cart = await cartService.addAddonToCart(req.user._id, addonId)
    res.json(cart)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function removeItem(req, res) {
  try {
    const { itemId } = req.params
    const cart = await cartService.removeItem(req.user._id, itemId)
    res.json(cart)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = {
  getCart,
  addHosting,
  addWordpress,
  addAddon,
  removeItem,
}
