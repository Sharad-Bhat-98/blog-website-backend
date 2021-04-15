const BLOG = require('../models/Blog')
const User = require('../models/users')
const fs = require('fs')
const formidable = require('formidable')

module.exports.get_Profile = (req, res) => {
    const user = req.params.user
    const obj = {}
    User.findById(user)
        .then((result) => {
            obj.user = result
        })
        .then(() => {
            BLOG.find({ userid: user })
                .then((result) => {
                    obj.blog = result
                    console.log(obj)
                    res.status(200).json(obj)
                })
                .catch((err) => {
                    console.log(err)
                    res.status(400).json({ err })
                })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json({ err })
        })
}

module.exports.get_Profile_pic = (req, res) => {
    User.findById(req.params.id)
        .then((result) => {
            console.log(result.photo.data, 'profile image')
            res.send(result.photo.data)
        })
        .catch((err) => {
            res.status(400).json({ error: 'errorloading image' })
        })
}

module.exports.updateProfile = (req, res) => {
    const profilePic = {
        data: '',
        contentType: '',
    }
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                error: 'incorrect Image',
            })
        }

        if (file.photo) {
            console.log(file)
            if (file.photo.size > 3000000) {
                res.status(400).json({
                    error: 'file sie too big',
                })
            }
            profilePic.data = fs.readFileSync(file.photo.path)
            profilePic.contentType = file.photo.type
            //  console.log(product)
            User.updateOne(
                { _id: req.params.id },
                { $set: { photo: profilePic } }
            )
                .then((result) => {
                    res.status(200).json({ data: 'profile updated' })
                })
                .catch((err) => {
                    res.status(400).json({ errors: 'profile not updated' })
                })
        }
    })
    // profilePic.data = fs.readFileSync(photo.path)
    // profilePic.contentType = photo.type
    // User.updateOne({ _id: req.params.id }, { $set: { photo: profilePic } })
    //     .then((result) => {
    //         res.status(200).json({ data: 'profile updated' })
    //     })
    //     .catch((err) => {
    //         res.status(400).json({ data: 'profile not updated' })
    //     })
}
