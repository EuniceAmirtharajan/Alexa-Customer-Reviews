require('dotenv').config({ path: '../.env' });
const addController = require('../src/controller/addReviews')
const searchController = require('../src/controller/searchReviews')
const mockReviewData = require('./data/testReviewData.json')
const mongoose = require('mongoose');
const reviewSchema = require('./data/reviewSchema')
const Review = require('../src/model/review');
const valid_ratings= 

console.log(process.env.COLLECTION_NAME)

describe('create and read reviews', () => {
    let db;
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    const reviews = reviewSchema;
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test_' + 'AlexaCustomerReviews', { useNewUrlParser: true, useUnifiedTopology: true });
        db = mongoose.connection;
        const collection = 'test_reviews';
        const existingCollections = await db.db.listCollections().toArray();
        if (existingCollections.length === 0) {
            await db.createCollection(collection);
        }
    });
    beforeEach(async () => {
        await reviews.insertMany(mockReviewData)
    });
    afterEach(async () => {
        await reviews.deleteMany({})
    })
    afterAll(async () => {
        const collection = 'test_' + 'reviews';
        await mongoose.connection.dropCollection(collection)
        await mongoose.connection.dropCollection('reviews')
        await mongoose.connection.dropDatabase().then(async () => {
            await mongoose.connection.close();
        })
    });
    it('get reviews without any filter', async () => {
        const dbRes = await reviews.find({})
        expect(dbRes.length).toBeGreaterThan(0)
    })
    it('get reviews with date filter', async () => {
        const dbRes = await reviews.find({ 'reviewed_date': { $lt: new Date('2017-12-08T00:00:00.000Z'), $gt: new Date('2017-12-07T00:00:00.000Z') } });
        expect(dbRes.length).toBeGreaterThan(0)
    })
    it('get reviews with rating filter', async () => {
        const dbRes = await reviews.find({ rating: 1 })
        expect(dbRes.length).toBeGreaterThan(0)
    })
    it('get reviews with store filter', async () => {
        const dbRes = await reviews.find({ store: 'iTunes' })
        expect(dbRes.length).toBeGreaterThan(0)
    })
    it('get monthly average rating per store', async () => {
        const dbRes = await reviews.aggregate([
            {
                $match:
                {
                    'review_source': 'iTunes',
                    'reviewed_date':
                    {
                        $gte: new Date('2017-11-07T00:00:00.000Z'),
                        $lt: new Date('2017-12-08T00:00:00.000Z')
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
        expect(dbRes[0].averageRating).toBeTruthy();
    })
    it('get number of reviews per rating', async () => {
        const dbRes = await reviews.aggregate([{
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
        expect(dbRes.length).toBeGreaterThan(0)
    })
    it('add or update a review', async () => {
        let filter = {
            'author': 'bmfb1980'
        }
        let update = {
            'review': 'test review',
            'author': 'bmfb1980',
            'review_source': 'iTunes',
            'rating': 1,
            'title': 'Needs major work.  Made by teenagers?',
            'product_name': 'Amazon Alexa',
            'reviewed_date': new Date('2022-07-12T04:13:12.000Z')
        }
        await reviews.countDocuments(filter);

        let doc = await Review.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        });
        expect(doc).toMatchObject(update)
    })
    it('get all reviews when no filter applied', async () => {
        const req = { query: {} };
        const res = mockResponse();
        await searchController.getReviews(req, res)
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('get all reviews with date filter', async () => {
        const req = { query: { date: '2017-12-07' } };
        const res = mockResponse();
        await searchController.getReviews(req, res)
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('get all reviews with rating filter', async () => {
        const req = { query: { rating: 1 } };
        const res = mockResponse();
        await searchController.getReviews(req, res)
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('get all reviews with store filter', async () => {
        const req = { query: { store: 'iTunes' } };
        const res = mockResponse();
        await searchController.getReviews(req, res)
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('get average rating per store', async () => {
        const req = { query: { store: 'iTunes', date: '2018-01-12' } };
        const res = mockResponse();
        await searchController.getMonthlyAverageRating(req, res)
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('get reviews by rating', async () => {
        const req = { query: { rating: 1 } };
        const res = mockResponse();
        await searchController.getReviewsByRating(req, res)
        expect(res.status).toHaveBeenCalledWith(200);
    });
    it('load data', async () => {
        await mongoose.connection.dropCollection('reviews').then(async () => {
            const req = {};
            const res = mockResponse();
            await addController.addMultipleReviews(req, res)
            expect(res.status).toBeTruthy();
        })

    });
    it('add or update new review', async () => {
        const req = {
            body: {
                'review': 'Test new author',
                'author': 'Man',
                'review_source': 'iTunes',
                'rating': 1,
                'title': 'After Latest Update My Device No Longer Connects',
                'product_name': 'Amazon Alexa',
                'reviewed_date': '2022-12-09T22:29:32.000Z'
            }
        };
        const res = mockResponse();
        await addController.addNewReview(req, res)
        expect(res.status).toHaveBeenCalledWith(200);
    });
});