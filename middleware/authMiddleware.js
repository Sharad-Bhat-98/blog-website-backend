const jwt = require('jsonwebtoken')
const User = require('../models/users')

const requireAuth = (req, res, next) => {
    console.log('error!!!!')
    const token = req.cookies.jwt

    //checck token exist or varifed
    if (token) {
        jwt.verify(token, 'sharad top secret', (err, decodedtoken) => {
            if (err) {
                res.status(401).json({ error: 'u are unauthroised' })
                console.log(err.message)
            } else {
                User.findById(decodedtoken.id)
                    .then((result) => {
                        next()
                    })
                    .catch((err) => {
                        res.status(401).json({ error: 'u are unauthroised' })
                    })
                console.log('decoded jwt!!!!', decodedtoken)
            }
        })
    } else {
        res.status(401).json({ error: 'u are unauthroised!!!!!!!' })
    }
}

//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, 'sharad top secret', async (err, decodedtoken) => {
            if (err) {
                console.log(err.message)
                next()
            } else {
                console.log(decodedtoken)
                let user = await User.findById(decodedtoken.id)
                next()
            }
        })
    } else {
    }
}

const isAuthenticated = (req, res) => {
    const token = req.cookies.jwt
    console.log(token, 'dffdffddd')
    if (token) {
        jwt.verify(token, 'sharad top secret', (err, decodedtoken) => {
            if (err) {
                res.status(401).json(false)
            } else {
                User.findById(decodedtoken.id)
                    .then((result) => {
                        res.status(200).json(true)
                    })
                    .catch((err) => {
                        res.status(401).json(false)
                    })
            }
        })
    } else {
        res.status(401).json(false)
    }
}

module.exports = { requireAuth, checkUser, isAuthenticated }
