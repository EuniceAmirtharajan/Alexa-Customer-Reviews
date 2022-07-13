
const requestParams = require('../util/commonUtil');
const searchService = require('../dbService/reviewService');
const logger = require('../util/logger');
/**
 * Retrieves reviews based on the search criteria
 * @param {*} req 
 * @param {*} res 
 */
async function getReviews(req, res) {
    logger.info('Entering getReviews')
    logger.debug('input for getReviews',req.query); 
    let reviews = [];
    let dbQuery = requestParams.fetchPathQueries(req)
    try {
        reviews = await searchService.readReviews(dbQuery)
        if (reviews.length === 0) {
            logger.info('No record found for getReviews'); 
            res.status(200).json({ message: 'No reviews found for the selected filter' });
        }
        else {
            res.status(200).json(reviews);
        }
    } catch (error) {
        logger.error('Error in getReviews',error)
        res.status(404).json({ message: error.message });
    }
}
/**
 * Calculates the average rating for a store on monthly basis
 * @param {*} req 
 * @param {*} res 
 */
async function getMonthlyAverageRating(req, res) {
    logger.info('Entering getMonthlyAverageRating')
    let result = []
    try {
        let dbQuery = requestParams.fetchPathQueries(req)
        result = await searchService.fetchMonthlyAverageRating(dbQuery)
        if (result.length === 0) {
            logger.info('No record found for getMonthlyAverageRating'); 
            res.status(200).json({ message: 'No reviews found for the selected filter' });
        }
        else {
            res.status(200).json({ 'store': result[0]._id, 'average_rating': Math.round(result[0].averageRating) });
        }
    }
    catch (error) {
        logger.error('Error in getMonthlyAverageRating',error)
        res.status(404).json({ message: error.message });
    }
}
/**
 * Retrieves total number of reviews based on the rating irrespective of store
 * @param {*} req 
 * @param {*} res 
 */
async function getReviewsByRating(req, res) {
    logger.info('Entering getReviewsByRating')
    let reviewData = []
    try {
        let dbQuery = requestParams.fetchPathQueries(req)
        logger.debug('Input for fetchReviewsByRating',dbQuery)
        reviewData = await searchService.fetchReviewsByRating(dbQuery)

        if (reviewData.length === 0) {
            res.status(200).json({ message: 'No reviews found for the selected filter' });
        }
        else {
            res.status(200).json({ reviewData });
        }
    }
    catch (error) {
        logger.error('Error in getReviewsByRating',error)
        res.status(404).json({ message: error.message });
    }
}
module.exports = {
    getReviews,
    getMonthlyAverageRating,
    getReviewsByRating
}