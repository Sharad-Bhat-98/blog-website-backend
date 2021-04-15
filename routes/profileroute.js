const { Router } = require('express')
const {
    get_Profile,
    get_Profile_pic,
    updateProfile,
} = require('../controllers/profilecontroller')
const { requireAuth } = require('../middleware/authMiddleware')

const router = Router()

router.get('/profile/:user', get_Profile)
router.get('/profile/img/:id', get_Profile_pic)
router.patch('/profile/img/:id', requireAuth, updateProfile)

module.exports = router
