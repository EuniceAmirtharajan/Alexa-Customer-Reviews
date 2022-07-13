const { body } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'createReview': {
            return [
                body('review').optional(),
                body('author').optional(),
                body('review_source').optional(),
                body('rating').optional().isInt(),
                body('title').optional(),
                body('product_name').optional(),
                body('reviewed_date').optional()
            ]
        }
    }
}