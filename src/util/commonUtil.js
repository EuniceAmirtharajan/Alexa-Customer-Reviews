const ValidFilters = require('./constants').valid_filters
const logger = require('../util/logger')
/**
 * Utility to fetch the queries from request path
 * @param {*} req 
 * @returns 
 */
function fetchPathQueries(req) {
    logger.info('Entering fetchPathQueries')
    let isDateCriteria = false;
    let dbQuery = {};
    logger.debug('Input for fetchPathQueries',req)
    if (Object.keys(req.query).length > 0) {
        for (const [key, value] of Object.entries(req.query)) {
            if (key === 'date') isDateCriteria = true
            dbQuery[ValidFilters[key]] = value;
        }
    }
    dbQuery['isDateCriteria'] = isDateCriteria;
    return dbQuery;
}

module.exports = {
    fetchPathQueries
}
