const mongoose = require('mongoose');

const CONNECTION_URL = process.env.CONNECTION_URL
const DATABASE_NAME = process.env.DATABASE_NAME
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