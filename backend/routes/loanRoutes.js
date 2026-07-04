const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.get('/', loanController.getLoans);

module.exports = router;
