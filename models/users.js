const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'please enter email'],
            unique: true,
            lowercase: true,
            validate: [isEmail, 'please entr valid email'],
        },
        password: {
            type: String,
            required: [true, 'please enter password'],
            minlength: [6, 'password should be atleast 6 charater'],
        },
        photo: {
            data: Buffer,
            contentType: String,
        },
    },
    { timestamps: true }
)

//mongoose hooks is fired after certain event takes place in our case after a user is stored in DB
userSchema.post('save', (doc, next) => {
    next()
})

//fire a function before doc is saved in DB we used normal function not arrow function cause normal function will bind this to user object
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

//static method to user login
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error('inccorrect password')
    }
    throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema)
module.exports = User
