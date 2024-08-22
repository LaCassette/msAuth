const UserController = require('../controller/UserController');
const userController = new UserController();

const AuthController = require('../controller/AuthController');
const authController = new AuthController();

module.exports = class SecurityValidator {
    async checker(username, email, password, res) {
        // Vérification des champs obligatoires
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing username, email, or password." });
        }
        
        // Validation du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email format error." });
        }

        // Vérification de la disponibilité du nom d'utilisateur
        const isUsernameAlreadyRegistered = await userController.findUserByUsername(username);
        if (isUsernameAlreadyRegistered) {
            return res.status(400).json({ message: "Username already in use." });
        }

        // Vérification de la disponibilité de l'email
        const isEmailAlreadyRegistered = await userController.findUserByEmail(email);
        if (isEmailAlreadyRegistered) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Validation du format du mot de passe
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must contain at least 8 characters, 1 number, 1 special character, and 1 uppercase letter." 
            });
        }

        // Enregistrement de l'utilisateur
        try {
            await authController.register({ username, email, password });
            return res.status(201).json({ message: "User successfully registered." });
        } catch (error) {
            console.error("Error details:", error); 
            return res.status(500).json({ message: "An error occurred while registering the user." });
        }
    }
}
