const router = require('express').Router();
const controller = require('../controllers/notaController');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { notaKontanSchema, notaHutangSchema, bayarHutangSchema } = require('../utils/schemas');

router.use(auth);
router.post('/kontan', validate(notaKontanSchema), controller.createKontan);
router.post('/hutang', validate(notaHutangSchema), controller.createHutang);
router.get('/hutang/:id', controller.detailHutang);
router.post('/hutang/:id/bayar', validate(bayarHutangSchema), controller.bayarHutang);

module.exports = router;
