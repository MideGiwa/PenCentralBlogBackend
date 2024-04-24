const express = require('express');
const router = express.Router();
const {authMiddleware, superAdminMiddleware} = require('../middlewares/authMiddleware');
const {signUp, login, signOut, getUsers, getOneUser, updateUser, deleteUser} = require('../controllers/userControllers');


// POST /create new users
router.post('/users/signup', signUp);

//  POST /authenticate new users
router.post('/users/login', login);

//  POST /log out active users
router.post('/users/signout', signOut);

// GET /all users
router.get('/users', authMiddleware, superAdminMiddleware, getUsers);

// GET /only superadmin can get a user
router.get('/users/:userId', authMiddleware, superAdminMiddleware, getOneUser);

// PATCH /only superadmin can update a user
router.patch('/users/:userId', authMiddleware, superAdminMiddleware, updateUser);

// DELETE /only superadmin can delete a user
router.delete('/users/:userId', authMiddleware, superAdminMiddleware, deleteUser);

module.exports = router;