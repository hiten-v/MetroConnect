require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const existing = await User.findOne({ email: 'admin@metro.com' })
    if (existing) {
      console.log('⚠️  Admin already exists')
      process.exit()
    }
    await User.create({
      name: 'Admin',
      email: 'admin@metro.com',
      password: 'admin123',
      role: 'admin'
    })
    console.log('✅ Admin created successfully')
    console.log('📧 Email:    admin@metro.com')
    console.log('🔑 Password: admin123')
  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    process.exit()
  }
})