const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
    port: process.env.PORT,
    dB_Url: process.env.MONGO_DB,
    jwtSecret: process.env.JWT_SECRET,
};


const connectToDb = async () => {
    try{
        mongoose.set('strictQuery', false);

        mongoose.connect(config.dB_Url);

        mongoose.connection.on('connected', () => {
            console.info('Database Connected Successfully');
        });
    } catch (error) {
        mongoose.connection.on('error', (error) => {
            console.error('Database Connection Error', error);
            process.exit(1);
        })
    }
}

module.exports = {
    config,
    connectToDb
}

