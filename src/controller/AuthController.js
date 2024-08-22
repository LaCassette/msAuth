const bcrypt = require('bcrypt');
const prisma = require('@prisma/client'); // Assurez-vous d'avoir installé Prisma
const UserController = require('./UserController');

module.exports = class AuthController {
    constructor() {
        this.prisma = new prisma.PrismaClient(); // Instance Prisma
        this.userService = new UserController()
    }

    // Login method
    async login(req, res) {
        const { username, password } = req.body;

        try {
            // Find the user by username
            const user = await this.prisma.user.findUnique({
                where: {
                    username: username
                }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Compare the password with the hash
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            // Assuming you have a session or JWT logic
            req.session.userId = user.id;
            return res.status(200).json({ message: 'Login successful', user: user });

        } catch (error) {
            return res.status(500).json({ error: 'Something went wrong', details: error.message });
        }
    }

    async register(req, res) {
            try {
                const { username, email, password } = req.body;
    
                // Vérifier si l'utilisateur existe déjà
                const existingUser = await this.prisma.user.findUnique({
                    where: {
                        OR: [
                            { username: username },
                            { email: email }
                        ]
                    }
                });
    
                if (existingUser) {
                    return res.status(400).json({ message: 'User already exists' });
                }
    
                // Hacher le mot de passe
                const password_hash = await bcrypt.hash(password, 10);
    
                // Créer un nouvel utilisateur
                const newUser = await this.prisma.user.create({
                    data: {
                        username,
                        email,
                        password_hash,
                    }
                });
    
                return res.status(201).json({ message: 'User registered successfully', user: newUser });
            } catch (error) {
                return res.status(500).json({ message: 'Registration failed', error: error.message });
            }
    }

    // Check User Session method
    async checkUser(req, res) {
        if (req.session && req.session.userId) {
            try {
                const user = await this.prisma.user.findUnique({
                    where: {
                        id: req.session.userId
                    }
                });

                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                return res.status(200).json({ message: 'User session active', user: user });
            } catch (error) {
                return res.status(500).json({ error: 'Something went wrong', details: error.message });
            }
        } else {
            return res.status(401).json({ error: 'No active session' });
        }
    }
}
