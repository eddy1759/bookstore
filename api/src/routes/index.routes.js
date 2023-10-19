const express = require('express');
const path = require('path');
const userRouter = require('./user.routes');
const bookRouter = require('./book.routes');

const router = express.Router();

const defaultRoute = [
    {
        path: '/auth',
        route: userRouter
    },
    {
        path: '/books',
        route: bookRouter
    }
]

defaultRoute.forEach(route => {
    router.use(route.path, route.route);
});

module.exports = router;