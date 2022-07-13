const dayjs = require('dayjs');
const Review = require('../model/review.js');
const valid_ratings = require('../util/constants').valid_ratings
const logger = require('../util/logger');
/**
 * Fetches reviews based on date or rating or store. If no filters are requested the entire collection will be returned
 * @param {*} dbQuery 
 * @returns 
 */
async function readReviews(dbQuery) {
    logger.info('Entering readReviews')
    let reviews = [];
    try {
        logger.debug('input for readReviews', dbQuery)
        if (dbQuery['isDateCriteria'] === true) {
            let startDate = dayjs(dbQuery['reviewed_date']).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            let dateValue = dayjs(dbQuery['reviewed_date']).date()
            let endDate = dayjs(startDate).set('date', dateValue + 1).toISOString();
            logger.debug(`startDate - ${startDate} and endDate- ${endDate}`)
            reviews = await Review.find({ 'reviewed_date': { $lt: endDate, $gte: startDate } });
        }
        else {
            logger.info('Entering readReviews non-date criteria')
            delete dbQuery['isDateCriteria']
            reviews = await Review.find(dbQuery);
        }
        return reviews;
    }
    catch (error) {
        logger.error('Error in readReviews', error);
        throw error;
    }
}
/**
 * For the given store and date this function will calculate the average rating for that particular store based on 1 month data
 * @param {*} dbQuery 
 * @returns 
 */
async function fetchMonthlyAverageRating(dbQuery) {
    logger.info('Entering fetchMonthlyAverageRating')
    let result = [];
    try {
        let dateValue = dayjs(dbQuery['reviewed_date']).date()
        let endDate = dayjs(dbQuery['reviewed_date']).set('date', dateValue + 1).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        let startDate = dayjs(endDate).set('date', dateValue - 30).toISOString();
        logger.debug(`startDate - ${startDate} and endDate- ${endDate}`)
        result = await Review.aggregate([
            {
                $match:
                {
                    'review_source': dbQuery['review_source'],
                    'reviewed_date':
                    {
                        $gte: new Date(startDate),
                        $lt: new Date(endDate)
                    }
                }
            },
            {
                $group:
                {
                    _id: '$review_source',
                    averageRating: { $avg: '$rating' },
                }
            }
        ])
        logger.debug(`result from averageRating query- ${result}`)
        return result;

    }
    catch (error) {
        logger.error('Error in fetchMonthlyAverageRating', error)
        throw error;
    }
}
/**
 * Counts the total number of reviews based on the requested rating, if no rating is requested count for all the ratings will be returned
 * @param {*} dbQuery 
 * @returns 
 */
async function fetchReviewsByRating(dbQuery) {
    logger.info('Entering fetchReviewsByRating')
    let reviewData = [];
    try {
        reviewData = await Review.aggregate([{
            $group: {
                _id: {
                    'rating': '$rating'
                },
                'number of reviews': {
                    $sum: {
                        $cond: [{ $in: ['1', valid_ratings] }, 1, 1]
                    }
                }
            }
        }])
        reviewData.map(rev => {
            rev['rating'] = rev['_id']['rating']
            rev['numberOfReviews'] = rev['number of reviews']
            delete rev['_id']
            delete rev['number of reviews']
        })

        let result = reviewData.map(value => value.rating);
        let missingValues = valid_ratings.filter(filterVal => !result.includes(filterVal));
        missingValues.forEach((missingVal) => {
            let missingReviews = {}
            missingReviews['rating'] = missingVal;
            missingReviews['numberOfReviews'] = 0
            reviewData.push(missingReviews)
        })
        if (dbQuery['rating'] != undefined) {
            reviewData = reviewData.filter((review) => review.rating == parseInt(dbQuery['rating']))
        }
        logger.debug('Response for fetchReviewsByRating', reviewData);
        return reviewData;
    }
    catch (error) {
        logger.error('Error in fetchReviewsByRating', error)
        throw error;
    }
}
/**
 * Based on the user name the review can be either updated or inserted
 * @param {*} filter 
 * @param {*} update 
 * @returns 
 */
async function addOrUpdateNewReview(filter, update) {
    logger.info('Entering addOrUpdateNewReview')
    try {
        await Review.countDocuments(filter);
        let doc = await Review.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        });
        return doc;
    } catch (error) {
        logger.error('Error in addOrUpdateNewReview', error)
        throw error;
    }

}
/**
 * To bulk insert review data
 * @param {*} reviewData 
 */
async function bulkInsertReviews(reviewData) {
    logger.info('Entering bulkInsertReviews')
    try {
        await Review.insertMany(reviewData);
    } catch (error) {
        logger.error('Error in bulkInsertReviews', error)
        throw error;
    }
}
module.exports = { readReviews, fetchMonthlyAverageRating, fetchReviewsByRating, addOrUpdateNewReview, bulkInsertReviews }