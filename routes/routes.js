const router = require('express').Router();
const {registerUsers, login, userLogin,logout} = require('../controllers/user.controllers');
router.post('/registerUsers',registerUsers);
router.post('/loginUser',login);
router.get('/user',userLogin);
router.post('/logout',logout);

module.exports = router;