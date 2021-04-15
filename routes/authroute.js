const { Router } = require('express')
const {
    signup_get,
    signup_post,
    signin_post,
    logout,
} = require('../controllers/authcontroller')
const { requireAuth, isAuthenticated } = require('../middleware/authMiddleware')
const router = Router()

router.get('/isauthenticated', isAuthenticated)
router.post('/signup', signup_post)
router.post('/signin', signin_post)
router.get('/logout', logout)
module.exports = router
