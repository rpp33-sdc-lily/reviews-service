var dbObject = require('../../database/index.js').db;
const mysql = require('mysql2');

var db = dbObject.db;

module.exports = {

  getReviews: (productId) => {
    var query = `SELECT r.review_id, r.rating, r.summary, r.recommend, NULLIF(r.response, 'null') as response, r.body, r.date, r.reviewer_name, r.helpfulness,
    if(count(p.photo_id) = 0, json_array(), JSON_ARRAYAGG(JSON_OBJECT('id', p.photo_id, 'url', p.url))) AS photos FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id
    WHERE product_id = ${productId} AND r.reported != 1 GROUP BY r.review_id;`;

    return db.queryAsync(query)
    .then(response => {
      // console.log('RESPONSE in get', response);
      return response;
    })
    // .catch(error => {
    //   console.log('error in obtaining reviews', error);
    // })
  },

  getMetaData: (productId) => {
    var query = `select rating, count(*) from reviews where product_id = ${productId} group by rating;`
    var result = {};
    return db.queryAsync(query)
    .then(response => {
      // console.log('response in getting rating meta data', response);
      result.ratings = response;
      var query = `SELECT recommend,COUNT(*) from reviews where product_id = ${productId} group by recommend;`
      return db.queryAsync(query)
    })
    .then(response => {
      // console.log('response in getting recommend meta data', response);
      result.recommended = response;
      var query = `SELECT id, name, value FROM (SELECT cr.characteristic_id as id, c.name as name, AVG(cr.value) AS value FROM characteristic_reviews cr INNER JOIN characteristics c ON cr.characteristic_id = c.characteristic_id WHERE c.product_id=${productId} GROUP BY c.name, cr.characteristic_id) T3;`

      return db.queryAsync(query)
    })
    .then(response => {
      result.characteristics = response;
      // console.log('characteristics response in models', response);
      return result;
    })
    // .catch(error => {
    //   console.log('error in obtaining meta data', error);
    // })
  },

  postReview: (reviewData) => {
    // console.log('this is the reviewData in models', reviewData);
    var reviewID;
    var query = `INSERT INTO reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, email, helpfulness) VALUES(null, ${reviewData.product_id}, ${reviewData.rating}, NOW(), '${reviewData.summary}', '${reviewData.body}', ${reviewData.recommend}, false, '${reviewData.name}', '${reviewData.email}', 0);`;
    console.log(' this is the query', query);
    return db.queryAsync(query)
    .then(response => {
      var getIDQuery = `SELECT review_id FROM reviews ORDER BY review_id DESC LIMIT 1;`;
      return db.queryAsync(getIDQuery)
      .then(response => {
        reviewID = response[0].review_id;
        // console.log('characteristics data', reviewData.characteristics)
        var charObject = reviewData.characteristics;

        var all = [];

        for (var key in charObject){
            var objectToPush = {};
            objectToPush[key] = charObject[key];
            all.push(objectToPush);
        }

        var promises = all.map(charReview => {
          // console.log('character review', charReview);
          var objKey;
          var objValue;
          for (var key in charReview){
              objKey = key;
              objValue = charReview[key];
          }
          var charQuery =`INSERT INTO characteristic_reviews(id, characteristic_id, review_id, value)
          VALUES(null, ${objKey}, ${reviewID}, ${objValue});`;
          return db.queryAsync(charQuery)
        })
        Promise.all(promises)
        .then(response => {
          return;
        })
        .catch(error => {
          console.log('error in promise all', error);
        })
      })
      .then(response => {
        var photosArray = reviewData.photos;
        // console.log('photos array', photosArray)
        if(photosArray.length > 0) {
          photosArray.forEach(photo => {
            var addPhotoQuery = `INSERT INTO photos(photo_id, review_id, url)
                                VALUES(null, ${reviewID}, "${photo}");`;
            return db.queryAsync(addPhotoQuery)
            .then(response => {
              console.log('successfully added photo in DB');
              return;
            })
            .catch(error => {
              console.log('error in adding photo to DB', error);
            })
          })
        } else {
          return;
        }
      })
    })
    .then(response => {
      console.log('successfully posting review', )
      return;
    })
    .catch(error => {
      console.log('error in posting review', error)
    })
  },


  markReviewHelpful: (id) => {
    var query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = ${id};`;
    return db.queryAsync(query)
    .then(response => {
      // console.log('RESPONSE', response);
      return;
    })
    // .catch(error => {
    //   console.log('error in marking review as helpful', error)
    // })
  },

  reportReview: (id) => {
    var query = `UPDATE reviews SET reported = true WHERE review_id = ${id};`;
    return db.queryAsync(query)
    .then(response => {
      // console.log('RESPONSE', response);
      return;
    })
  }
}
