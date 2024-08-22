const prisma = require('@prisma/client');
const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

module.exports = class UserController {
    constructor() {
        this.prisma = prismaClient;
    }

    // Méthode pour trouver un utilisateur par son nom d'utilisateur
    async findUserByUsername(username) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { username: username },
            });
            return user ? true : false;
        } catch (error) {
            throw new Error("Failed to find user by username.");
        }
    }

    // Méthode pour trouver un utilisateur par son email
    async findUserByEmail(email) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: email },
            });
            return user ? true : false;
        } catch (error) {
            throw new Error("Failed to find user by email.");
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;

            const user = await this.prisma.user.findUnique({
                where: { id: parseInt(id) },
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Failed to get user', error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.prisma.user.findMany();

            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Failed to get users', error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { username, email, company_id } = req.body;

            const updatedUser = await this.prisma.user.update({
                where: { id: parseInt(id) },
                data: {
                    username,
                    email,
                    company_id,
                },
            });

            res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update user', error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            await this.prisma.user.delete({
                where: { id: parseInt(id) },
            });

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete user', error: error.message });
        }
    }
}
