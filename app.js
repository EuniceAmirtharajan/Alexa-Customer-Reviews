require('dotenv').config();
const express = require('express');
const dbConfig = require('./src/config/dbConfig');
const cors = require('cors');
const reviewRoutes = require('./src/routes/reviewRoutes.js');
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(reviewRoutes);

/**
 * Start the server and also make sure whether mongo server is running.If not, display a warning message since the app requires stable db connection for smooth user experience
 */
const startServer = async () => {
    try {
        await dbConfig.connectDBServer();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    } catch (error) {
        console.log(error);
        console.log('Failed to connect to the database, server is not running since this app requires DB connection for smooth user experience.');
    }
};

startServer();