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


const defaultExpiration = 99;


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
      console.log('this is respones back to clinet,',typeof responseBackToClient)
      return responseBackToClient;
    })
    .then(response => {
      console.log('response in 5888', response);
      return response;
    })
    .catch(error => {
      res.status(500).send({ message: 'error in getting reviews'});
      })
  })

  .catch(error => {
    console.log('error in 58', error)
    res.status(500).send({ message: 'error in line 55'});
    })

  res.status(200).send(reviews);

});


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


app.get('/reviews/meta', (req, res) => {
  var id = parseInt(req.query.product_id);

  // console.log('should be product id', id);
  models.getMetaData(id)
  .then(response => {
    // console.log('response in server', response);
    return helperFunctions.sortMetaData(response, id);
  })
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log('error in getting meta data', error);
    res.status(500).send({ message: 'error in getting meta data'});
  })
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
  // await redisClient.connect();
  console.log('am i wiii?')

  return new Promise (async(resolve, reject) => {
    console.log('am i looo?', key)
    // if (error) {
    //   console.log('error in promise', error)
    //   return reject(error)
    // }
    // resolve('asdfsdf');
    console.log('redisClient', redisClient.get)
    // return redisClient.get(key, (error, data) => {
    //   console.log('am i here?')
    //   if (error) {
    //     console.log('inside if block')
    //     // await redisClient.disconnect();
    //     reject(error);
    //   }
    //   if (data != null) {
    //     console.log('GETTING FROM REDIS')
    //     // await redisClient.disconnect();
    //     resolve(JSON.parse(data));
    //   }
    //   // const freshData = await cb();
    //   // redisClient.setex(key, defaultExpiration, JSON.stringify(freshData));
    //   // await redisClient.disconnect();
    //   resolve('freshData');
    // })(
    const value = await redisClient.get(key);
    console.log('line 180000', value)

    if (value != null) {
      console.log('value in if statement', value)
      resolve(JSON.parse(value));
    } else {

        // console.log('callback', cb())
        return cb()
        .then(freshData => {
          console.log('!!!!!!1$#$freshData', freshData)
          redisClient.set(key, JSON.stringify(freshData));
          redisClient.expire(key, defaultExpiration);
          resolve(freshData);
        })
        .catch(error => {
          console.log('error line 188', error)
          reject(error);
        })
        // resolve('still doesnt resolve')
    }
    resolve('this doesnt resolve anything')
    // return redisClient.get(key)
    // .then((response) => {
    //   console.log('response in then', response);
    //   if (response === null) {
    //     const freshData = cb()
    //     .then(response => {
    //       redisClient.setex(key, defaultExpiration, JSON.stringify(freshData));
    //       resolve(freshData);
    //     })
    //   }
    //   resolve(response);
    // })
    // .catch(error => {
    //   console.log('error for redisclient.get', error)
    // })
    //  resolve('asdfsdf');
  })
  .then(response => {
    console.log('response in then statement', response)
    return response;
  })
  .catch(error => {
    console.log('error in line 169')
    return;
  })
  // console.log('error in line 171')

}

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






