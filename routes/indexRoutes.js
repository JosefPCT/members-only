const express = require('express');

const controller = require('../controllers/indexController');

const router = express.Router();



router.get('', controller.getIndex);

router.get('/register', controller.getRegister);
router.post('/register', controller.postRegister);

router.get('/login', controller.getLogin);
router.post('/login', controller.postLogin);

router.get('/login-success', controller.loginSuccessGetRoute);
router.get('/login-failure', controller.loginFailureGetRoute);

router.get('/logout', controller.logoutGetRoute);

router.get('/become-a-member', controller.becomeMemberGetRoute);
router.post('/become-a-member', controller.becomeMemberPostRoute);

router.get('/messages/new', controller.newMessageGetRoute);
router.post('/messages/new', controller.newMessagePostRoute);


router.get('/protected-route', controller.protectedGetRoute);
router.get('/admin-route', controller.adminGetRoute);


module.exports = router;