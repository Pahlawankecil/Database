const router = require('express').Router();
const { summary } = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.get('/summary', auth, summary);

module.exports = router;
