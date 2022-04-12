var db = require('../../database/index.js').db;

module.exports = {

  getReviews: (productId) => {
    // var query = `SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness FROM reviews WHERE product_id = ${productId};`;
    // var query = `SELECT r.review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness,
    //             JSON_ARRAYAGG(JSON_OBJECT('id', p.photo_id, 'url', p.url)) AS photos FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id
    //             WHERE product_id = ${productId} GROUP BY r.review_id;`;
    // var query = `SELECT r.review_id, r.rating, r.summary, r.recommend, NULLIF(r.response, 'null') as response, r.body, r.date, r.reviewer_name, r.helpfulness,
    //         JSON_ARRAYAGG(JSON_OBJECT('id', p.photo_id, 'url', p.url)) AS photos FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id
    //         WHERE product_id = ${productId} AND r.reported != 1 GROUP BY r.review_id;`;
    // var query = `SELECT r.review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness,
    // COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.photo_id, 'url', p.url))), '[]') AS photos FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id
    // WHERE product_id = ${productId} GROUP BY r.review_id;`;
    // var query = `SELECT COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.photo_id, 'url', p.url))), '[]') AS photos FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id
    // WHERE product_id = ${productId} GROUP BY r.review_id;`;
    // var query = `select coalesce(photosTwo.photoID, '[]') as photos FROM(SELECT r.review_id as reviewID, p.photo_id as photoID, p.url, p.review_id AS photos FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id WHERE product_id = ${productId}) as photosTwo;`;

    // var query = `select IFNULL(photosTwo.photoID, '[]') as photos FROM(SELECT r.review_id as reviewID, p.photo_id as photoID, p.url, p.review_id AS photos FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id WHERE product_id = ${productId}) as photosTwo;`;
    var query = `SELECT r.review_id, r.rating, r.summary, r.recommend, NULLIF(r.response, 'null') as response, r.body, r.date, r.reviewer_name, r.helpfulness,
            JSON_ARRAYAGG(JSON_OBJECT('id', p.photo_id, 'url', p.url)) as photos FROM reviews r LEFT JOIN photos p ON r.review_id = p.review_id
            WHERE product_id = ${productId} AND r.reported != 1 GROUP BY r.review_id;`;

    return db.queryAsync(query)
    .then(response => {
      console.log('RESPONSE', response[1].photos);
      console.log('RESPONSE', response[2].photos);
      console.log('RESPONSE', response);
      // response is almost good except for photos array when there are no photos (it should be an empty array)
      // also shouldn't be returning reported reviews
      return response;
    })
    .catch(error => {
      console.log('error in obtaining reviews', error);
    })
  },

  getMetaData: (productId) => {
    // var query = `SELECT rating, recommend FROM reviews WHERE product_id = ${productId};`;
    // var query = `SELECT rating,COUNT(*) from reviews where product_id = ${productId} group by rating;`;
    var query = `SELECT rating,COUNT(*) from reviews where product_id = ${productId} group by rating;`;
    var result = {};
    return db.queryAsync(query)
    .then(response => {
      console.log('response in getting meta data', response);
      result.ratings = response;
      var query = `SELECT recommend,COUNT(*) from reviews where product_id = ${productId} group by recommend;`
      return db.queryAsync(query)
    })
    .then(response => {
      console.log('response in getting meta data', response);
      result.recommended = response;
      var query = `select * from characteristic_reviews inner join characteristics on characteristic_reviews.characteristic_id = characteristics.characteristic_id where characteristics.product_id=${productId};`
      return db.queryAsync(query)
    })
    .then(response => {
      result.characteristics = response;
      return result;
    })
    .catch(error => {
      console.log('error in obtaining meta data', error);
    })
  },

  postReview: (reviewData) => {
    console.log('this is the reviewData in models', reviewData);
    var query = `INSERT INTO reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, email, helpfulness)
                VALUES(null, ${parseInt(reviewData.product_id)}, ${parseInt(reviewData.rating)}, NOW(), ${reviewData.summary}, ${reviewData.body}, ${reviewData.recommend}, false, ${reviewData.name}, ${reviewData.email}, 0);`;
    return db.queryAsync(query)
    .then(response => {
      var photosArray = JSON.parse(reviewData.photos);
      console.log('photos array', photosArray)
      if(photosArray.length > 0) {
        var photoQuery = `SELECT review_id FROM reviews ORDER BY review_id DESC LIMIT 1;`
        return db.queryAsync(photoQuery)
        .then(response => {
          var reviewID = response[0].review_id;
          console.log('response in photo query', response);
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
        })
      } else {
        console.log('RESPONSE', response);
        return;
      }
    })
    .catch(error => {
      console.log('error in posting review', error)
    })
  },

  markReviewHelpful: (id) => {
    var query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = ${id};`;
    return db.queryAsync(query)
    .then(response => {
      console.log('RESPONSE', response);
      return;
    })
    .catch(error => {
      console.log('error in marking review as helpful', error)
    })
  },

  reportReview: (id) => {
    var query = `UPDATE reviews SET reported = true WHERE review_id = ${id};`;
    return db.queryAsync(query)
    .then(response => {
      console.log('RESPONSE', response);
      return;
    })
    .catch(error => {
      console.log('error in reporting review', error)
    })
  }
}




// select json_arrayagg(
//   json_object(
//     'id'     value id,
//     'name'   value name,
//     'things' value coalesce(
//     (
//       select json_arrayagg(
//                json_object (
//                  'thing' value thing
//                )
//                order by thing
//              )
//       from things t
//       where t.people_id = p.id
//     ), '[]') format json
//   )
// ) json_test
// from people p;