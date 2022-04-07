const express = require('express');
let app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const db = require('../database/index.js').db;
const models = require('./models/index.js');

app.get('/', (req, res) => {
  res.status(200).send('anything');
})

app.get('/test', (req, res) => {
  console.log('passing the test?!?!')
  res.send({message: 'passing the test!'})
});

app.get('/reviews',(req, res) => {

  res.status(200).send({});
});

app.get('/reviews/meta', (req, res) => {

  res.status(200).send({});
});

app.post('/reviews', (req, res) => {

  res.status(200).send({});
});

app.put('/reviews/:review_id/helpful', (req, res) => {

  res.status(200).send({});
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