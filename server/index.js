const express = require('express');
var bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

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