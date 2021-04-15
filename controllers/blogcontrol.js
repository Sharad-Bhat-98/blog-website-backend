const BLOG = require('../models/Blog')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')

module.exports.get_blog = async (req, res) => {
    try {
        const blogs = await BLOG.find({})
        res.status(200).json({ blogs })
    } catch {
        res.status(400)
    }
}

module.exports.post_blog = (req, res) => {
    console.log('working')
    // const form = formidable({ multiples: true })
    // form.parse(req, (err, fields, files) => {
    //     console.log('working')
    //     if (err) {
    //         next(err)
    //         return
    //     } else {
    //         res.status(200).json({ fields, files })
    //     }
    // })
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    //console.log(form)
    form.parse(req, (err, fields, file) => {
        console.log(fields)
        if (err) {
            console.log(err)
            res.status(400).json({
                error: 'incorrect Image',
            })
        }

        let product = new BLOG(fields)
        console.log(product)

        if (file.photo) {
            if (file.photo.size > 3000000) {
                res.status(400).json({
                    error: 'file sie too big',
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
            //  console.log(product)
        }

        product.save((err, result) => {
            if (err) {
                res.status(400).json({
                    error: 'blog not created',
                })
            }
            res.json(result)
        })
    })
    // const { email, userid, blogdata, blogimage, blogtitle } = req.body

    // try {
    //     const blog = await BLOG.create({
    //         email,
    //         userid,
    //         blogdata,
    //         blogimage,
    //         blogtitle,
    //     })
    //     res.status(201).json({ blog })
    // } catch {
    //     res.status(400)
    // }
}

module.exports.delete_blog = (req, res) => {
    const id = req.params.id

    BLOG.deleteOne({ _id: id })
        .then((res) => {
            res.status(200).json({ res })
        })
        .catch((err) => {
            res.status(400).json({ err })
        })
}

module.exports.update_blog = (req, res) => {
    const { id, blogdata } = req.body

    BLOG.updateOne({ _id: id }, { $set: { blogdata } })
        .then((result) => {
            res.status(200).json({ result })
        })
        .catch((err) => {
            res.status(400).json({ err })
            console.log(err)
        })
}

module.exports.get_blogimg = (req, res) => {
    BLOG.findOne({ _id: req.params.id })
        .then((result) => {
            res.send(result.photo.data)
        })
        .catch((err) => {
            res.status(400).json({ err: 'error fetching image' })
        })
}

module.exports.get_blogdetails = (req, res) => {
    BLOG.findById(req.params.id)
        .then((result) => {
            res.status(200).json({ result })
        })
        .catch((err) => {
            res.status(400).json({ err })
        })
}
