const express = require('express');
const addReview = require('../controller/addReviews.js');
const searchReview = require('../controller/searchReviews.js');
const reviewRouter = express.Router();

//route to fetch reviews
reviewRouter.get('/fetchReviews', (req, res) => {
    searchReview.getReviews(req, res)
});
//route to get average monthly rating
reviewRouter.get('/averageRating', (req, res) => {
    searchReview.getMonthlyAverageRating(req, res)
});
//route to get total number of reviews per rating
reviewRouter.get('/reviewsByRating', (req, res) => {
    searchReview.getReviewsByRating(req, res)
});
//route to add new review
reviewRouter.post('/addReview', (req, res) => {
    addReview.addNewReview(req, res)
});
//route to bulk insert reviews
reviewRouter.post('/addAllReviews', (req, res) => {
    addReview.addMultipleReviews(req, res)
});

module.exports = reviewRouter;