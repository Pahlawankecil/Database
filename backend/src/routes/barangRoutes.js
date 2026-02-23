const router = require('express').Router();
const controller = require('../controllers/barangController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { barangSchema } = require('../utils/schemas');

router.use(auth);
router.get('/', controller.list);
router.post('/', validate(barangSchema), controller.create);
router.put('/:id', validate(barangSchema), controller.update);
router.post('/:id/duplicate', controller.duplicate);
router.delete('/:id', controller.remove);

module.exports = router;
