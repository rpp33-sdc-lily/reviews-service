const express = require('express');
let app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const db = require('../database/index.js').db;
const models = require('./models/index.js');
models.getReviews();

//serve static file here later?

app.get('/', (req, res) => {
  res.status(200).send('anything');
})

app.get('/test', (req, res) => {
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

  res.status(200).send({});
});


let port = 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

module.exports = app;