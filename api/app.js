const express = require('express');
const cors = require('cors');
const { config, connectToDb } = require('./src/config/config');
const ApiRoute = require('./src/routes/index.routes');

const app = express();

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api', ApiRoute);

app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Welcome to our Bookstore',
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        status: false,
        message: 'Route not found',
    });
});

app.listen(config.port, () => {
    console.info(`Server is running on port ${config.port}`);
});