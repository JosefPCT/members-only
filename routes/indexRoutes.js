const express = require('express');

const controller = require('../controllers/indexController');

const router = express.Router();

router.get('', controller.getIndex);

router.get('/register', controller.getRegister);

router.get('/login', controller.getLogin);

module.exports = router;