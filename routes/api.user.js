const express = require('express');
const router = express.Router();



const api_user = require('../controllers/api.user');




router.get('/getAll', api_user.getAll);
router.get('/:userId', api_user.getById);
router.post('/register', api_user.addUser);
router.post('/login', api_user.userLogin);
router.put('/updateUser/:userId', api_user.updateById);
router.post('/changePassword/:userId', api_user.changePassword);




module.exports = router;
