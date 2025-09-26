const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const crypto = require('crypto')
const { Resend } = require('resend')

const saltRounds = 10
const resend = new Resend(process.env.RESEND_API_KEY)

async function register(req, res) {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Missing fields' })

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) return res.status(400).json({ error: 'Email already in use' })

  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
  })
  res.status(201).json({ id: user._id, email: user.email, name: user.name })
}

async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'Missing fields' })

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) return res.status(400).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' })

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  )

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  })
}

async function profile(req, res) {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
  })
}

async function updateProfile(req, res) {
  const { name, email, phone, password } = req.body
  if (!name && !email && !phone && !password)
    return res.status(400).json({ error: 'Nothing to update' })
  if (name) req.user.name = name
  if (email) req.user.email = email.toLowerCase()
  if (password) {
    const passwordHash = await bcrypt.hash(password, saltRounds)
    req.user.passwordHash = passwordHash
  }
  if (phone) req.user.phone = phone
  await req.user.save()
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
  })
}

async function forgotPassword(req, res) {
  const { email } = req.body

  try {
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // For security, don't reveal if email exists or not
      return res.json({
        message:
          'If an account with that email exists, a password reset code has been sent.',
      })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Hash OTP before saving
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex')
    user.resetPasswordToken = hashedOtp
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000) // 15 min from now
    await user.save()

    const { data, error } = await resend.emails.send({
      from: 'Web Hosting <onboarding@resend.dev>',
      to: [email],
      subject: 'Password Reset Code - Web Hosting',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .code { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Web Hosting</h1>
                    <h2>Password Reset</h2>
                </div>
                <div class="content">
                    <p>Hello ${user.name},</p>
                    <p>You requested a password reset for your Web Hosting account. Use the following code to reset your password:</p>
                    
                    <div class="code">${otp}</div>
                    
                    <p>This code will expire in <strong>15 minutes</strong>.</p>
                    <p>If you didn't request this reset, please ignore this email.</p>
                    
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Web Hosting. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `Password Reset Code: ${otp}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this reset, please ignore this email.`,
    })

    if (error) {
      console.error('Resend error:', error)
      return res
        .status(500)
        .json({ error: 'Failed to send email. Please try again.' })
    }

    console.log('Email sent successfully:', data)
    return res.json({
      message:
        'If an account with that email exists, a password reset code has been sent.',
    })
  } catch (err) {
    console.error('Forgot password error:', err)
    res
      .status(500)
      .json({ error: 'Failed to process request. Please try again.' })
  }
}

async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body

  try {
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (!user.resetPasswordToken || !user.resetPasswordExpires)
      return res
        .status(400)
        .json({ error: 'No reset request found or code has expired' })

    if (user.resetPasswordExpires.getTime() < Date.now()) {
      // Clear expired token
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()
      return res
        .status(400)
        .json({ error: 'Reset code has expired. Please request a new one.' })
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex')
    if (hashedOtp !== user.resetPasswordToken)
      return res.status(400).json({ error: 'Invalid reset code' })

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters long' })
    }

    const passwordHash = await bcrypt.hash(newPassword, saltRounds)
    user.passwordHash = passwordHash
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    // Send confirmation email
    await resend.emails.send({
      from: 'Web Hosting <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Password Reset Successful - Web Hosting',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; text-align: center; color: white; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Web Hosting</h1>
                    <h2>Password Updated</h2>
                </div>
                <div class="content">
                    <p>Hello ${user.name},</p>
                    <p>Your password has been successfully reset.</p>
                    <p>If you did not make this change, please contact support immediately.</p>
                    
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Web Hosting. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `Your password has been successfully reset.\n\nIf you did not make this change, please contact support immediately.`,
    })

    res.json({
      message:
        'Password reset successful. You can now log in with your new password.',
    })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

module.exports = {
  register,
  login,
  profile,
  updateProfile,
  forgotPassword,
  resetPassword,
}
