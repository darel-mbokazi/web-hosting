const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const supportRoutes = require('./routes/support')
const userRoutes = require('./routes/user')
const domainRoutes = require('./routes/domain')
const hostingRoutes = require('./routes/hosting')
const wordpressRoutes = require('./routes/wordpress')
const addonRoutes = require('./routes/addon')
const cartRoutes = require('./routes/cart')
const checkoutRoutes = require('./routes/checkout')
const ticketRoutes = require('./routes/ticket')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.get('/favicon.ico', (req, res) => {
  res.status(204).end() 
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/support', supportRoutes)
app.use('/api/user', userRoutes)
app.use('/api/domain', domainRoutes)
app.use('/api/hosting', hostingRoutes)
app.use('/api/wordpress', wordpressRoutes)
app.use('/api/addon', addonRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/checkout', checkoutRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Backend deployed successfully!' })
})

app.use(errorHandler)

module.exports = app
