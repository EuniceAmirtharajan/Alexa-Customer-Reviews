const mongoose = require('mongoose');

const CONNECTION_URL = require('../config/commonConfig').CONNECTION_URL;
const DATABASE_NAME =  require('../config/commonConfig').DATABASE_NAME;
mongoose.Promise = global.Promise;

function connectDBServer() {
    return mongoose.connect(`${CONNECTION_URL}${DATABASE_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}
module.exports = {
    connectDBServer
};