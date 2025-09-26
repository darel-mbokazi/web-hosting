const Domain = require('../models/Domain')
const dotenv = require('dotenv')
const Cart = require('../models/Cart')
const { default: axios } = require('axios')

dotenv.config()

const WHOIS_API_KEY = process.env.WHOIS_API_KEY
const WHOIS_API_URL = 'https://api.apilayer.com/whois/check'

// supported ext and their prices
const EXT_PRICES = {
  '.com': 100.0,
  '.net': 120.0,
  '.org': 130.0,
}

// validate extension
function getExtension(domainName) {
  const extension = domainName
    .substring(domainName.lastIndexOf('.'))
    .toLowerCase()
  if (!EXT_PRICES[extension]) {
    throw new Error(
      `Extension "${extension}" is not supported here at Web-Hosting`
    )
  }
  return extension
}

// Check WHOIS availability
async function searchDomain(domainName) {
  // extract & validate extension
  const _extension = getExtension(domainName)

  // heck local DB
  const existing = await Domain.findOne({ name: domainName })
  if (existing) {
    return {
      domainName,
      available: false,
      status: 'registered (local DB)',
    }
  }

  // Check WHOIS API
  const response = await axios.get(`${WHOIS_API_URL}?domain=${domainName}`, {
    headers: { apikey: WHOIS_API_KEY },
  })

  const data = response.data
  const isAvailable = data.result === 'available'

  return {
    domainName,
    available: isAvailable,
    status: data.result,
  }
}

async function registerDomain({ name, userId }) {
  // extract & validate extension
  const extension = getExtension(name)

  // check if already exists in local DB
  const existing = await Domain.findOne({ name })
  if (existing) {
    throw new Error(`Domain is already registered (${name})`)
  }

  // check WHOIS API
  const result = await searchDomain(name)
  if (!result.available) {
    throw new Error(`Domain is already registered (${result.domainName})`)
  }

  // register new domain for 1 year
  const expiryDate = new Date()
  expiryDate.setFullYear(expiryDate.getFullYear() + 1)

  const domain = await Domain.create({
    name: result.domainName,
    price: EXT_PRICES[extension],
    status: 'registered',
    userId,
    expiryDate,
    registrationPeriod: 1,
  })

  // add to cart automatically
  let cart = await Cart.findOne({ userId })
  if (!cart) {
    cart = await Cart.create({ userId, items: [], total: 0 })
  }

  cart.items.push({
    itemType: 'domain',
    itemId: domain._id,
    name: domain.name,
    price: domain.price,
    registrationPeriod: 1,
  })

  cart.total = cart.items.reduce((sum, item) => sum + item.price, 0)
  await cart.save()

  return { domain, cart }
}

module.exports = {
  searchDomain,
  registerDomain,
}
