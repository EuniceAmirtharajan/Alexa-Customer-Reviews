# Alexa-Customer-Reviews
Application to view and create customer reviews for Alexa
---
## Requirements

Develop a REST web service (in Node.js) that does the following 

1. Accepts reviews and stores them 
2. Allows to fetches reviews 
3. Reviews can be filtered by date, store type or rating. 
4. All filters are optional; fetch all reviews if no filters are applied. 
5. Allows to get average monthly ratings per store. 
6. Allows to get total ratings for each category. Meaning, how many 5*, 4*, 3* and so on 
7. A 3rd party browser application shall be able to access the service. 
8. Implement test cases to validate the code. 


### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

## Install

    $ git clone https://github.com/EuniceAmirtharajan/Alexa-Customer-Reviews.git
    $ cd PROJECT_TITLE
    $ npm install


## Running the project

    $ npm run start
    
## Available APIs
1. http://localhost:5000/addAllReviews - BUlk insert review data in to the database through a data file
2. http://localhost:5000/addReview - Insert a single review 
3. http://localhost:5000/fetchReviews - Fetch all the reviews without any search criteria
4. http://localhost:5000/fetchReviews?store=GooglePlayStore - Fetch only the reviews those match the given store name
5. http://localhost:5000/fetchReviews?date=2017-12-7 - Fetch only the reviews those reviewed date is same as the given date
6. http://localhost:5000/fetchReviews?rating=1 - Fetch only the reviews those have the rating as same as the requested rating
7. http://localhost:5000/averageRating?date=2017-12-06&store=iTunes - Calculates the monthly average of the rating for the requested store 
{
    "store": "iTunes",
    "average_rating": 2
}
8. http://localhost:5000/reviewsByRating?rating=1 - Returns the total number of reviews per rating when rating is not given in the request params 
{
    "reviewData": [
        {
            "rating": 2,
            "numberOfReviews": 928
        },
        {
            "rating": 3,
            "numberOfReviews": 743
        },
        {
            "rating": 4,
            "numberOfReviews": 482
        },
        {
            "rating": 1,
            "numberOfReviews": 2520
        },
        {
            "rating": 5,
            "numberOfReviews": 1437
        }
    ]
}
or
http://localhost:5000/reviewsByRating - when a specific rating is given, the reviews count will be returned only for that specific rating 
{
    "store": "iTunes",
    "average_rating": 2
}
## Running the unit test cases

    $ npm run test
## code coverage

    $ npm run test-coverage
     PASS  test/database.test.js (32.859 s)
  create and read reviews
    √ get reviews without any filter (382 ms)
    √ get reviews with date filter (137 ms)
    √ get reviews with rating filter (131 ms)
    √ get reviews with store filter (133 ms)
    √ get monthly average rating per store (122 ms)
    √ get number of reviews per rating (105 ms)
    √ add or update a review (139 ms)
    √ get all reviews when no filter applied (1157 ms)
    √ get all reviews with date filter (122 ms)
    √ get all reviews with rating filter (443 ms)
    √ get all reviews with store filter (216 ms)
    √ get average rating per store (119 ms)
    √ get reviews by rating (128 ms)
    √ load data (21952 ms)
    √ add or update new review (88 ms)

 PASS  test/controller/addReview.test.js
  addReviews
    √ add a review (6 ms)
    √ insert reviews in bulk (1 ms)

 PASS  test/controller/searchReview.test.js
  searchReviews
    √ get reviews (2 ms)
    √ get monthly average (2 ms)
    √ get reviews based on rating (3 ms)

-------------------|---------|----------|---------|---------|---------------------------------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|---------------------------------------------
All files          |   82.58 |    66.66 |   95.45 |   82.18 |
 src/config        |     100 |      100 |     100 |     100 |
  commonConfig.js  |     100 |      100 |     100 |     100 |
 src/controller    |   76.05 |       50 |     100 |   76.05 |
  addReviews.js    |   81.81 |      100 |     100 |   81.81 | 30-31,48-49,65-66
  searchReviews.js |   71.05 |       50 |     100 |   71.05 | 18-19,25-26,41-42,49-50,67,74-75
 src/dbService     |      80 |       75 |      90 |    79.1 |
  reviewService.js |      80 |       75 |      90 |    79.1 | 30-31,72-73,107-110,119-120,139-140,153-154
 src/model         |     100 |      100 |     100 |     100 |
  review.js        |     100 |      100 |     100 |     100 |
 src/util          |     100 |       75 |     100 |     100 |
  commonUtil.js    |     100 |      100 |     100 |     100 |
  constants.js     |     100 |      100 |     100 |     100 |
  logger.js        |     100 |       50 |     100 |     100 | 18-20
 test/data         |     100 |      100 |     100 |     100 |
  reviewSchema.js  |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|---------------------------------------------
Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        35.836 s
Ran all test suites.
