const {
    addMultipleReviews,
    addNewReview
} = require('../../src/controller/addReviews')
const addontroller = require('../../src/controller/addReviews');
const reviewData = require('../data/testReviewData.json')
jest.mock('../../src/controller/addReviews')

describe('addReviews', () => {
    it('add a review', async () => {
        const mReq = { body: {} };
        const mRes = { sendStatus: jest.fn() };
        let reviewToInsert = {
            'review': "Thanks to the most recent app update, my phone and my Amazon device are no longer paired and I can't get them to work together again.You've just made my Amazon device almost completely unusable.",
            'author': 'Test Author',
            'review_source': 'iTunes',
            'rating': 1,
            'title': 'After Latest Update My Device No Longer Connects',
            'product_name': 'Amazon Alexa',
            'reviewed_date': '2017-12-09T22:29:32.000Z'
        }
        jest.spyOn(addontroller, 'addNewReview').mockResolvedValueOnce(reviewToInsert);
        let insertedData = await addNewReview(mReq, mRes);
        expect(insertedData).toEqual(reviewToInsert);
    })
    it('insert reviews in bulk', async () => {
        const mReq = {};
        const mRes = { sendStatus: jest.fn() };
        jest.spyOn(addontroller, 'addMultipleReviews').mockResolvedValueOnce(reviewData);
        let queriedData = await addMultipleReviews(mReq, mRes);
        expect(queriedData).toEqual(reviewData);
    })
})