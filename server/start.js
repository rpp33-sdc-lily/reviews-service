const app = require('./index.js')

let port = 5000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});
