const { Router } = require('express')
const {
    get_blog,
    post_blog,
    delete_blog,
    update_blog,
    get_blogimg,
    get_blogdetails,
} = require('../controllers/blogcontrol')
const { requireAuth } = require('../middleware/authMiddleware')

const router = Router()

router.get('/blog', get_blog)
router.get('/blogimg/:id', get_blogimg)
router.post('/createblog', requireAuth, post_blog)
router.delete('/deleteblog/:id', requireAuth, delete_blog)
router.patch('/updateblog', requireAuth, update_blog)
router.get('/blog/:id', get_blogdetails)

module.exports = router
