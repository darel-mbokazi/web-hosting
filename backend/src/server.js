require('dotenv').config()
require('express-async-errors') 

const app = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

async function start() {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
