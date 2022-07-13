const fs = require('fs');
const readline = require('readline');
const alexaReviewData = './src/model/alexaReviewData.txt';
const reviewService = require('../dbService/reviewService');
const logger = require('../util/logger');

/**
 * Reads review data from the file and transforms it to valid json
 * @returns 
 */
function readAndConvertDataFile() {
    logger.info('Entering readAndConvertDataFile')
    return new Promise((resolve, reject) => {
        let reviewDataArray = [];
        try {
            var readData = readline.createInterface({
                input: fs.createReadStream(alexaReviewData)

            });

            readData.on('line', (line) => {
                reviewDataArray.push(JSON.parse(line));
            });
            readData.on('close', () => {
                logger.info('Completed reading the input data file')
                resolve(reviewDataArray)

            })
        } catch (err) {
            logger.error('Error in readAndConvertDataFile', err)
            reject(err)
        }
    })
}
/**
 * Insert multiple review records
 * @param {*} req 
 * @param {*} res 
 */
async function addMultipleReviews(req, res) {
    logger.info('Entering addMultipleReviews')
    try {
        let loadedData = await readAndConvertDataFile();
        await reviewService.bulkInsertReviews(loadedData)
        res.status(200).json({ message: 'Documents uploaded successfully' });

    } catch (error) {
        logger.error('Error in addMultipleReviews', error)
        res.status(500).json({ message: error.message });
    }
}
/**
 * Check whether the author has published a review if yes update the existing record with new data else insert the new review document
 * @param {*} req 
 * @param {*} res 
 */
async function addNewReview(req, res) {
    logger.info('Entering addNewReview')
    try {
        const filter = { 'author': req.body.author };
        const update = req.body;
        let doc = await reviewService.addOrUpdateNewReview(filter, update);
        res.status(200).json({ doc });
    } catch (error) {
        logger.error('Error in addNewReview', error)
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addMultipleReviews,
    addNewReview
}
