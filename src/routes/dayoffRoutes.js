const express = require('express');
const router = express.Router();
const dayoffController = require('../controllers/dayoffController');

router.get('/', dayoffController.getAll);
router.post('/', dayoffController.create);

module.exports = router;
