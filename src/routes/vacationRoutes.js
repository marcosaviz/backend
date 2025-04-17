const express = require('express');
const router = express.Router();
const vacationController = require('../controllers/vacationController');

router.get('/', vacationController.getAll);
router.post('/', vacationController.create);

module.exports = router;
