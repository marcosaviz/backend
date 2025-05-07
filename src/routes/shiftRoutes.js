const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

router.post('/generate', shiftController.generate);
router.get('/', shiftController.list);
router.delete('/delete', shiftController.deleteAll);




module.exports = router;
