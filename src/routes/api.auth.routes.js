const router = require('express').Router();
const AuthController = require('../controller/AuthController');
const authController = new AuthController();
const SecurityValidator = require('../validators/SecurityValidator');
const securityValidator = new SecurityValidator();

// Route pour la connexion
router.post('/login', async (req, res, next) => {
    try {
        await authController.login(req, res);
    } catch (error) {
        next(error);  // Passer l'erreur au middleware d'erreur global
    }
});

// Route pour l'inscription avec validation
router.post('/register', async (req, res, next) => {
    try {
        // const { username, email, password } = req.body;
        // await securityValidator.checker(username, email, password, res);
        await authController.register(req, res);
    } catch (error) {
        next(error);  // Passer l'erreur au middleware d'erreur global
    }
});

// Route pour vérifier la session/utilisateur
router.post('/check', async (req, res, next) => {
    try {
        await authController.checkUser(req, res);
    } catch (error) {
        next(error);  // Passer l'erreur au middleware d'erreur global
    }
});

module.exports = router;
