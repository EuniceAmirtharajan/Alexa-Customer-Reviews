const fs = require('fs');
const readline = require('readline');
const alexaReviewData = './src/model/alexaReviewData.txt';
const reviewService = require('../dbService/reviewService');

/**
 * Reads review data from the file and transforms it to valid json
 * @returns 
 */
function readAndConvertDataFile(){
    return new Promise((resolve,reject)=>{
        let reviewDataArray = [];
        try{
            var readData = readline.createInterface({
                input: fs.createReadStream(alexaReviewData)
                
            });
            
            readData.on('line', (line)=> {
                reviewDataArray.push(JSON.parse(line));
            });
            readData.on('close', ()=>{
               console.log('read complete')
                resolve(reviewDataArray)
              
            })
        } catch (err) {
            console.log(err);
            reject(err)
          }
        })
}
/**
 * Insert multiple review records
 * @param {*} req 
 * @param {*} res 
 */
async function addMultipleReviews(req,res){
    try {
        readAndConvertDataFile().then(async reviewData=>{
            await reviewService.bulkInsertReviews(reviewData)
            res.status(200).json({message: 'Documents uploaded successfully'});
        })
  
    } catch(error) {
        res.status(404).json({message: error.message});
    }
}
/**
 * Check whether the author has published a review if yes update the existing record with new data else insert the new review document
 * @param {*} req 
 * @param {*} res 
 */
async function addNewReview(req,res){
    try {
        const filter = { 'author': req.body.author };
        const update = req.body;
       let doc= await reviewService.addOrUpdateNewReview(filter,update);
       
        res.status(200).json({doc});
    } catch(error) {
        res.status(404).json({message: error.message});
    }
}

module.exports={
    addMultipleReviews,
    addNewReview
}
