const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { login, me } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { loginSchema } = require('../utils/schemas');

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Terlalu banyak percobaan login' });

router.post('/login', limiter, validate(loginSchema), login);
router.get('/me', auth, me);

module.exports = router;
