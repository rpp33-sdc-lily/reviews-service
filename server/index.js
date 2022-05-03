const express = require('express');
let app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const dbObject = require('../database/index.js').db;
const models = require('./models/index.js');
const helperFunctions = require('./helperFunctions.js');
const Redis = require('redis');

// const redisClient = Redis.createClient({
//   host:'localhost',
//   port:6379});
const redisClient = Redis.createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

redisClient.on('connect', function() {
  console.log('Connected!');
});


const defaultExpiration = 3600;


app.get('/loaderio-628bd481c3f7576c7dea956314bea40f.txt', (req, res) => {
  res.status(200).send('loaderio-628bd481c3f7576c7dea956314bea40f');
});

app.get('/', (req, res) => {
  res.status(200).send('bla');
})

app.get('/test', (req, res) => {
  res.status(200).send({message: 'passing the test!'})
});


app.get('/reviews/', async (req, res) => {
  var id = parseInt(req.query.product_id);
  var reviews = await getOrSetCache(`reviews?productId=${id}`, () => {
    console.log('NOT GETTING FROM REDIS');

    return models.getReviews(id)
    .then(response => {
      var responseBackToClient = {
        "product": id.toString(),
        "page": parseInt(req.query.page),
        "count": parseInt(req.query.count),
        "results": response
      };
      console.log('this is respones back to client,',typeof responseBackToClient)
      return responseBackToClient;
    })
    .then(response => {
      console.log('response in 5888', response);
      return response;
    })
    .catch(error => {
      res.status(500).send({ message: 'error in getting reviews from my db'});
      })
  })
  .catch(error => {
    console.log('error in getting reviews from redis', error)
    res.status(500).send({ message: 'error in getting reviews from redis'});
    })

  res.status(200).send(reviews);

});


app.get('/reviews/meta', async (req, res) => {
  var id = parseInt(req.query.product_id);

  var metaData = await getOrSetCache(`reviews/meta?productId=${id}`, () => {
    console.log('NOT GETTING FROM REDIS')
    return models.getMetaData(id)
    .then(response => {
      // console.log('response in server', response);
      return helperFunctions.sortMetaData(response, id);
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      // console.log('error in getting meta data', error);
      res.status(500).send({ message: 'error in getting meta data from my db'});
    })
  })
  .catch(error => {
    console.log('error in getting meta data from redis', error)
    res.status(500).send({ message: 'error in getting meta data from redis'});
    })
  res.status(200).send(metaData);
});


app.post('/reviews', (req, res) => {
  console.log('body parameters when posting a review', req.body);
  models.postReview(req.body)
  .then(response => {
    res.status(201).send({ message: 'successfully posting a review'});
  })
  .catch(error => {
    // console.log('error in server side in posting a review', error)
    res.status(403).send();
  })
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  var id = req.params.review_id;
  models.markReviewHelpful(id)
  .then(response => {
    res.status(204).send();
  })
  .catch(error => {
    // console.log('error in server side in marking review as helpful', error)
    res.status(500).send();
  })
});

app.put('/reviews/:review_id/report', (req, res) => {
  // console.log('review_id', req.params.review_id);
  var id = req.params.review_id;
  models.reportReview(id)
  .then(response => {
    res.status(204).send();
  })
  .catch(error => {
    // console.log('error in server side in reporting review', error)
    res.status(500).send();
  })
});


async function getOrSetCache(key, cb) {

  return new Promise (async(resolve, reject) => {

    const value = await redisClient.get(key);

    if (value != null) {
      console.log('GETTING FROM REDIS')
      resolve(JSON.parse(value));
    } else {
        return cb()
        .then(freshData => {
          // console.log('!!!!!!1$#$freshData', freshData)
          redisClient.set(key, JSON.stringify(freshData));
          redisClient.expire(key, defaultExpiration);
          resolve(freshData);
        })
        .catch(error => {
          console.log('error line 188', error)
          reject(error);
        })
    }
    // resolve('this doesnt resolve anything')
  })
  .then(response => {
    // console.log('response in then statement', response)
    return response;
  })
  .catch(error => {
    console.log('error in line 207', error)
    return;
  })

}

// write app.close function that closes db connection
app.close = () => {
  dbObject.connectionTwo.end();
}

module.exports = app;

















// app.get('/reviews/',(req, res) => {
//   var id = parseInt(req.query.product_id);
//   models.getReviews(id)
//   .then(response => {
//     var responseBackToClient = {
//       "product": id.toString(),
//       "page": parseInt(req.query.page),
//       "count": parseInt(req.query.count),
//       "results": response
//     };
//     res.status(200).send(responseBackToClient);
//   })
//   .catch(error => {
//     res.status(500).send({ message: 'error in getting reviews'});
//   })
// });


// app.get('/reviews/meta', (req, res) => {
//   var id = parseInt(req.query.product_id);

//   // console.log('should be product id', id);
//   models.getMetaData(id)
//   .then(response => {
//     // console.log('response in server', response);
//     return helperFunctions.sortMetaData(response, id);
//   })
//   .then(response => {
//     res.status(200).send(response);
//   })
//   .catch(error => {
//     // console.log('error in getting meta data', error);
//     res.status(500).send({ message: 'error in getting meta data'});
//   })
// });


