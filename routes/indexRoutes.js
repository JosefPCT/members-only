const express = require('express');

const controller = require('../controllers/indexController');

const router = express.Router();

router.get('', controller.getIndex);

module.exports = router;