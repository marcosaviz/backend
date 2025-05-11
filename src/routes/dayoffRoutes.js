const express = require('express');
const router = express.Router();
const dayoffController = require('../controllers/dayoffController');

router.get('/', dayoffController.getAll);
router.post('/', dayoffController.create);
router.delete('/:id', dayoffController.delete);
module.exports = router;
