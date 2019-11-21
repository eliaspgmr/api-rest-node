const express    = require('express')
const bcrypt     = require('bcryptjs')
const jwt        = require('jsonwebtoken')
const crypto     = require('crypto')
const mailer     = require('../../modules/mailer') 
const User       = require('../models/user')
const authConfig = require('../../config/auth.json')

const router = express.Router()

function generateToken(params = {}) {
    return jwt.sign(
        params,
        authConfig.secret,
        {
            expiresIn: 86400
        }
    )
}

router.post('/register', async (req, res) => {
    const { email } = req.body
    try {
        if(await User.findOne({ email })) {
            return res.status(400).send({ error: 'User already exists!' })
        }

        const user = await User.create(req.body)

        user.password = undefined

        const token = generateToken({ id: user._id })

        return res.send({ user, token })
    } catch (error) {
        return res.status(400).send({ error: 'registration failed' })
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body
    const loginfaild = 'User or Password invalid!'

    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user)
            return res.status(400).send({ error: loginfaild })

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: loginfaild })

        user.password = undefined

        const token = generateToken({ id: user._id })

        return res.send({ user, token })
    } catch (error) {
        return res.status(400).send({ error: 'login failed' })
    }
})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if(!user)
            return res.status(400).send({ error: "Email dosn't exixt on ours databases!" })

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        }) 

        mailer.sendMail({
            to: email,
            from: 'suporte@gmail.com',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) => {
            if(err) {
                return res.status(400).send({ error: 'Cannot send email' })
            }
            
            return res.send({ Message: 'Email sent successfully!'})
        })

    } catch (error) {
        res.status(400).send({ error: 'Error on forgot password' })
    }
})

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body

    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')

        if(!user)
            return res.status(400).send({ error: "Email dosn't exixt on ours databases!" })
        
        if(token !== user.passwordResetToken )
            return res.status(400).send({ error: "Invalid token!" })
        
        const now = new Date()

        if(user.passwordResetExpires < now)
            return res.status(400).send({ error: "Time expired!" })
        
        user.password = password

        await user.save()

        res.send({ message: 'password reseted' })
    } catch (error) {
        res.status(400).send({ error: 'Cannot reset password!' })
    }
})

module.exports = app => app.use('/auth', router)
