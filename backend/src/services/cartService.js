const Cart = require('../models/Cart')
const HostingPlan = require('../models/HostingPlan')
const Addon = require('../models/Addon')
const WordpressHosting = require('../models/WordpressHosting')

async function getCart(userId) {
  let cart = await Cart.findOne({ userId })
  if (!cart) {
    cart = await Cart.create({ userId, items: [], total: 0 })
  }
  return cart
}

async function addHostingToCart(userId, hostingId) {
  const hosting = await HostingPlan.findById(hostingId)
  if (!hosting) throw new Error('Hosting plan not found')

  let cart = await getCart(userId)

  cart.items.push({
    itemType: 'hosting',
    itemId: hosting._id,
    name: hosting.name,
    price: hosting.price,
    billingCycle: hosting.billingCycle,
  })

  cart.total = cart.items.reduce((sum, item) => sum + item.price, 0)
  await cart.save()

  return cart
}

async function addWordpressToCart(userId, wordpressId) {
  const wordpress = await WordpressHosting.findById(wordpressId)
  if (!wordpress) throw new Error('Wordpress not found')
    
  let cart = await getCart(userId)

  cart.items.push({
    itemType: 'wordpress',
    itemId: wordpress._id,
    name: wordpress.name,
    price: wordpress.price,
    billingCycle: wordpress.billingCycle,
  })

  cart.total = cart.items.reduce((sum, item) => sum + item.price, 0)
  await cart.save()

  return cart
}

async function addAddonToCart(userId, addonId) {
  const addon = await Addon.findById(addonId)
  if (!addon) throw new Error('Addon not found')

  let cart = await getCart(userId)

  cart.items.push({
    itemType: 'addon',
    itemId: addon._id,
    name: addon.name,
    price: addon.price,
    billingCycle: addon.billingCycle,
  })

  cart.total = cart.items.reduce((sum, item) => sum + item.price, 0)
  await cart.save()

  return cart
}

async function removeItem(userId, itemId) {
  let cart = await getCart(userId)
  cart.items.pull({ itemId })
  cart.total = cart.items.reduce((sum, item) => sum + item.price, 0)
  await cart.save()
  return cart
}

// Clear cart after successful checkout
async function clearCart(userId) {
  const cart = await getCart(userId)
  cart.items.splice(0, cart.items.length)
  cart.total = 0
  await cart.save()
  return cart
}

module.exports = {
  getCart,
  addHostingToCart,
  addWordpressToCart,
  addAddonToCart,
  removeItem,
  clearCart,
}
