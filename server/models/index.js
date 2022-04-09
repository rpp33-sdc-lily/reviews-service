var db = require('../../database/index.js').db;

module.exports = {

  getReviews: (productId) => {
    var query = `SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness FROM reviews WHERE product_id = ${productId};`;

    return db.queryAsync(query)
    .then(response => {
      console.log('RESPONSE', response)
      return response;
    })
    .catch(error => {
      console.log('error in obtaining reviews', error)
    })
  },

  postReview: (reviewData) => {
    console.log('this is the reviewData in models', reviewData);
    // console.log('type of email', typeof reviewData.email);
    var query = `INSERT INTO reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, email, helpfulness)
                VALUES(null, ${parseInt(reviewData.product_id)}, ${parseInt(reviewData.rating)}, NOW(), ${reviewData.summary}, ${reviewData.body}, ${reviewData.recommend}, false, ${reviewData.name}, ${reviewData.email}, 0);`;

    return db.queryAsync(query)
    .then(response => {
      // have to find way to get review_id so that I can then insert review photos into photos table and link with review_id(foreign key)
      console.log('RESPONSE', response);
      return;
    })
    .catch(error => {
      console.log('error in marking review as helpful', error)
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
