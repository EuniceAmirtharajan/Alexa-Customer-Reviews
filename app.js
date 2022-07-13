const express = require('express');
const dbConfig = require('./src/config/dbConfig');
const expressValidator = require('express-validator')
const PORT = require('./src/config/commonConfig').PORT;
const cors = require('cors');
const reviewRoutes = require('./src/routes/reviewRoutes.js');
const morganMiddleware = require("./src/middlewares/morgan.middleware");
const logger = require("./src/util/logger");

const app = express();
app.use(morganMiddleware);
app.use(express.json());
app.use(expressValidator())
app.use(cors());
app.use(reviewRoutes);

/**
 * Start the server and also make sure whether mongo server is running.If not, display a warning message since the app requires stable db connection for smooth user experience
 */
app.listen(PORT, async () => {
    logger.info('Server is running on port', PORT)
    try {
        logger.info('Trying to connect to the database')
        await dbConfig.connectDBServer();
        logger.info('Connected to the database')
    }
    catch (error) {
        logger.error(`Failed to connect to the database-${error}`)
    }
});