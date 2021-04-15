const mongoose = require('mongoose')
const User = require('./users')

const BlogSchema = new mongoose.Schema(
    {
        email: {
            type: 'String',
            required: true,
            lowercase: [true, 'email required'],
        },
        userid: {
            type: 'String',
            required: [true, 'user ID required'],
        },
        blogdata: {
            type: 'String',
            required: [true, 'BLOG should not be empty'],
        },
        blogtitle: {
            type: 'String',
            required: [true, 'blog title required'],
        },
        photo: {
            data: Buffer,
            contentType: String,
        },
    },
    { timestamps: true }
)

BlogSchema.pre('save', async function (next) {
    console.log('working')
    const data = await User.findOne({ _id: this.userid })
    console.log(data)
    if (data) {
        console.log('working')
        this.email = data.email
        next()
    } else {
        console.log(data.err)
    }
})

const BLOG = mongoose.model('blog', BlogSchema)
module.exports = BLOG
