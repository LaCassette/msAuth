const bcrypt = require('bcrypt');
const prisma = require('@prisma/client'); // Assurez-vous d'avoir installé Prisma

module.exports = class AuthController {
    constructor() {
        this.prisma = new prisma.PrismaClient(); // Instance Prisma
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

    // Register method
    async register(req, res) {
        const { username, email, password, company_id } = req.body;

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the user
            const newUser = await this.prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    password_hash: hashedPassword,
                    company_id: company_id
                }
            });

            return res.status(201).json({ message: 'User registered successfully', user: newUser });

        } catch (error) {
            if (error.code === 'P2002') { // Unique constraint failed
                return res.status(400).json({ error: 'Username or email already taken' });
            }
            return res.status(500).json({ error: 'Something went wrong', details: error.message });
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
