const express = require('express');
var bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/test', (req, res) => {
  res.send({message: 'passing the test!'})
});



let port = 3000;

// app.listen(port, function() {
//   console.log(`listening on port ${port}`);
// });

module.exports = app;