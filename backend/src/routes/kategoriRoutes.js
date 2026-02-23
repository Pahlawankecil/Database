const router = require('express').Router();
const controller = require('../controllers/kategoriController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { kategoriSchema } = require('../utils/schemas');

router.use(auth);
router.get('/', controller.list);
router.post('/', validate(kategoriSchema), controller.create);
router.put('/:id', validate(kategoriSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
