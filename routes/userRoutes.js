const express = require('express');
const verifyToken = require('../middleware/authmiddleware'); 
const { registerUser, loginUser, getUserDetails } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getUserDetails); 

module.exports = router;
