const ValidFilters = Object.freeze({
    store: 'review_source',
    date: 'reviewed_date',
    rating: 'rating'
});

function fetchPathQueries(req) {
    let isDateCriteria = false;
    let dbQuery = {};
    console.log(req)
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
