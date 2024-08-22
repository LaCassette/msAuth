const router = require('express').Router();

const authRoutes = require('./api.auth.routes');
const userRoutes = require('./api.user.routes');

const defaultRoutes = [
    {
        path: "/auth",
        routes: authRoutes,
    },
    {
        path: "/user",
        routes: userRoutes,
    }
];

defaultRoutes.forEach((r) => {
    router.use(r.path, r.routes);
});

// Middleware global pour la gestion des erreurs
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "An unexpected error occurred.", error: err.message });
});

module.exports = router;
