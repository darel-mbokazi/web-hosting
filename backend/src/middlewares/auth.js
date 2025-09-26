const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ error: 'Unauthorized' })

  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.userId).select('-passwordHash')
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token', err })
  }
}

// helper for role guards
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    if (req.user.role !== role)
      return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}

module.exports = { authMiddleware, requireRole }
