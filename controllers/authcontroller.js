const User = require('../models/users')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const formidable = require('formidable')
const fs = require('fs')
//handel error
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { email: '', password: '' }
    if (err.message === 'incorrect email') {
        errors.email = 'email not registred'
    }
    if (err.message === 'inccorrect password') {
        errors.password = 'password incorrect'
    }
    if (err.code === 11000) {
        errors.email = 'email already exists'
        return errors
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}
const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({ id }, 'sharad top secret', {
        expiresIn: maxAge,
    })
}

module.exports.signup_post = (req, res) => {
    console.log(req.body, 're.body')

    function createobj(email, password) {
        this.email = email
        this.password = password
        this.photo = { data: '', contentType: '' }
    }

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    //console.log(form)
    form.parse(req, (err, fields, file) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                error: 'incorrect Image',
            })
        }
        const { email, password } = fields
        let product = new createobj(email, password)
        console.log(product, 'fgfg')
        console.log(file)

        if (file.photo) {
            if (file.photo.size > 3000000) {
                res.status(400).json({
                    error: 'file sie too big',
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
            console.log(product)
        }

        User.create(product)
            .then((user) => {
                res.status(201).json({ user: user._id })
            })
            .catch((err) => {
                const errors = handleErrors(err)
                res.status(400).json({ errors })
            })
        //  const token= await createToken(user._id);
        //   res.cookie('jwt',token,{ maxAge:maxAge*1000})
    })
    //  const {email,password}=req.body
    //  try {
    //      const user= await User.create({email,password});
    //     //  const token= await createToken(user._id);
    //     //   res.cookie('jwt',token,{ maxAge:maxAge*1000})
    //      res.status(201).json({user:user._id})
    //  }catch (err){
    //    const errors=handleErrors(err)
    //    res.status(400).json({errors})
    //  }
}

module.exports.signin_post = async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    try {
        const user = await User.login(email, password)
        const token = await createToken(user._id)
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000,
            secure: true,
            sameSite: 'none',
        })
        res.status(200).json({ user: user._id })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports.signup_get = (req, res) => {
    res.send('signup page')
}

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1, secure: true, sameSite: 'none' })
    res.send('deleted')
}
