const router = require('express').Router();
const UserController = require('../controller/UserController');
const userController = new UserController();

// Route pour récupérer un utilisateur par ID
router.get('/:id', async (req, res, next) => {
    try {
        await userController.getUserById(req, res);
    } catch (error) {
        next(error);  // Passer l'erreur au middleware d'erreur global
    }
});

// Route pour récupérer tous les utilisateurs
router.get('/all', async (req, res, next) => {
    try {
        await userController.getAllUsers(req, res);
    } catch (error) {
        next(error);  // Passer l'erreur au middleware d'erreur global
    }
});

// Route pour mettre à jour un utilisateur par ID
router.put('/:id', async (req, res, next) => {
    try {
        await userController.updateUser(req, res);
    } catch (error) {
        next(error);  // Passer l'erreur au middleware d'erreur global
    }
});

// Route pour supprimer un utilisateur par ID
router.delete('/:id', async (req, res, next) => {
    try {
        await userController.deleteUser(req, res);
    } catch (error) {
        next(error);  // Passer l'erreur au middleware d'erreur global
    }
});

module.exports = router;