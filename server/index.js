const express = require('express');
let app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const dbObject = require('../database/index.js').db;
const models = require('./models/index.js');
const helperFunctions = require('./helperFunctions.js');

app.get('/', (req, res) => {
  res.status(200).send('anything');
})

app.get('/test', (req, res) => {
  res.status(200).send({message: 'passing the test!'})
});

app.get('/reviews/',(req, res) => {
  var id = parseInt(req.query.product_id);
  console.log('should be product id', id)
  models.getReviews(id)
  .then(response => {
    var responseBackToClient = {
      "product": id.toString(),
      "page": parseInt(req.query.page),
      "count": parseInt(req.query.count),
      "results": response
    };
    console.log('response back to client', responseBackToClient);
    console.log('response before sending to client', response);
    res.status(200).send(responseBackToClient);
  })
  .catch(error => {
    console.log('error in getting reviews', error);
  })
});

app.get('/reviews/meta', (req, res) => {
  var id = parseInt(req.query.product_id);

  console.log('should be product id', id);
  models.getMetaData(id)
  .then(response => {
    console.log('response in server', response);
    return helperFunctions.sortMetaData(response, id);
  })
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log('error in getting meta data', error);
  })
});

app.post('/reviews', (req, res) => {
  console.log('body parameters when posting a review', req.body);
  models.postReview(req.body)
  .then(response => {
    res.status(201).send({ message: 'successfully posting a review'});
  })
  .catch(error => {
    console.log('error in server side in posting a review', error)
  })
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  var id = req.params.review_id;
  models.markReviewHelpful(id)
  .then(response => {
    res.status(204).send({ message: 'successfully marking review as helpful'});
  })
  .catch(error => {
    console.log('error in server side in marking review as helpful', error)
  })
});

app.put('/reviews/:review_id/report', (req, res) => {
  console.log('review_id', req.params.review_id);
  var id = req.params.review_id;
  models.reportReview(id)
  .then(response => {
    res.status(204).send({ message: 'successfully reporting review'});
  })
  .catch(error => {
    console.log('error in server side in reporting review', error)
    // add res.status 500 to send back to client
  })
});

// write app.close function that closes db connection
app.close = () => {
  dbObject.connectionTwo.end();
}

module.exports = app;


















// .then(response => {
//   console.log('successfully added char rating in DB');
//   var photosArray = JSON.parse(reviewData.photos);
//   console.log('photos array', photosArray)
//   if(photosArray.length > 0) {
//     photosArray.forEach(photo => {
//       var addPhotoQuery = `INSERT INTO photos(photo_id, review_id, url)
//                           VALUES(null, ${reviewID}, "${photo}");`;
//       return db.queryAsync(addPhotoQuery)
//       .then(response => {
//         console.log('successfully added photo in DB');
//         return;
//       })
//       .catch(error => {
//         console.log('error in adding photo to DB', error);
//       })
//     })
//   } else {
//     console.log('RESPONSE', response);
//     return;
//   }
// })






