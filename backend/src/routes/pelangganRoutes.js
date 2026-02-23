const router = require('express').Router();
const controller = require('../controllers/pelangganController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { pelangganSchema } = require('../utils/schemas');

router.use(auth);
router.get('/', controller.list);
router.post('/', validate(pelangganSchema), controller.create);
router.put('/:id', validate(pelangganSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
