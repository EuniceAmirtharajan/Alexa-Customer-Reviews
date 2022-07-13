
const requestParams = require('../util/commonUtil');
const searchService = require('../dbService/reviewService');
/**
 * Retrieves reviews based on the search criteria
 * @param {*} req 
 * @param {*} res 
 */
async function getReviews(req, res) {
    console.log(req.query)
    let reviews = [];
    let dbQuery = requestParams.fetchPathQueries(req)
    try {
        reviews = await searchService.readReviews(dbQuery)
        if (reviews.length === 0) {
            res.status(200).json({ message: 'No reviews found for the selected filter' });
        }
        else {
            res.status(200).json(reviews);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
/**
 * Calculates the average rating for a store on monthly basis
 * @param {*} req 
 * @param {*} res 
 */
async function getMonthlyAverageRating(req, res) {
    let result = []
    try {
        let dbQuery = requestParams.fetchPathQueries(req)
        result = await searchService.fetchMonthlyAverageRating(dbQuery)
        if (result.length === 0) {
            res.status(200).json({ message: 'No reviews found for the selected filter' });
        }
        else {
            res.status(200).json({ 'store': result[0]._id, 'average_rating': Math.round(result[0].averageRating) });
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}
/**
 * Retrieves total number of reviews based on the rating irrespective of store
 * @param {*} req 
 * @param {*} res 
 */
async function getReviewsByRating(req, res) {
    let reviewData = []
    try {
        let dbQuery = requestParams.fetchPathQueries(req)
        console.log(dbQuery)
        reviewData = await searchService.fetchReviewsByRating(dbQuery)

        if (reviewData.length === 0) {
            res.status(200).json({ message: 'No reviews found for the selected filter' });
        }
        else {
            res.status(200).json({ reviewData });
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}
module.exports = {
    getReviews,
    getMonthlyAverageRating,
    getReviewsByRating
}