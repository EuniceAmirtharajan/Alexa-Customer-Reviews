
const {
  getReviews,
  getMonthlyAverageRating,
  getReviewsByRating
} = require('../../src/controller/searchReviews')
const searchController = require('../../src/controller/searchReviews');
const reviewData = require('../data/testReviewData.json')
jest.mock('../../src/controller/searchReviews')

describe('searchReviews', () => {
  it('get reviews', async () => {
    const mReq = { query: {} };
    const mRes = { sendStatus: jest.fn() };
    jest.spyOn(searchController, 'getReviews').mockResolvedValueOnce(reviewData);
    let queriedData = await getReviews(mReq, mRes);
    expect(queriedData).toEqual(reviewData);
  })
  it('get monthly average', async () => {
    const mReq = { query: { store: 'iTunes', date: '2017-12-07' } };
    const mRes = { sendStatus: jest.fn() };
    let averageData = {
      'store': 'iTunes',
      'average_rating': 1
    }
    jest.spyOn(searchController, 'getMonthlyAverageRating').mockResolvedValueOnce(averageData);
    let queriedData = await getMonthlyAverageRating(mReq, mRes);
    expect(queriedData).toEqual(averageData);
  })
  it('get reviews based on rating', async () => {
    const mReq = { query: { rating: 1 } };
    const mRes = { sendStatus: jest.fn() };
    let ratingCount = {
      'rating': '1',
      'count': 8
    }
    jest.spyOn(searchController, 'getReviewsByRating').mockResolvedValueOnce(ratingCount);
    let queriedData = await getReviewsByRating(mReq, mRes);
    expect(queriedData).toEqual(ratingCount);
  })
})