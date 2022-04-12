const express = require('express');
let app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const db = require('../database/index.js').db;
const models = require('./models/index.js');
const helperFunctions = require('./helperFunctions.js');

app.get('/', (req, res) => {
  res.status(200).send('anything');
})

app.get('/test', (req, res) => {
  console.log('passing the test?!?!')
  res.send({message: 'passing the test!'})
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
    console.log('response in server', response)
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
    res.status(200).send({ message: 'successfully posting a review'});
  })
  .catch(error => {
    console.log('error in server side in posting a review', error)
  })
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  var id = req.params.review_id;
  models.markReviewHelpful(id)
  .then(response => {
    res.status(200).send({ message: 'successfully marking review as helpful'});
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
    res.status(200).send({ message: 'successfully reporting review'});
  })
  .catch(error => {
    console.log('error in server side in reporting review', error)
  })
});


let port = 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

module.exports = app;