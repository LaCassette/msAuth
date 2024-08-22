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

module.exports = router;
