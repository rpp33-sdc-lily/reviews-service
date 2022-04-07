var db = require('../../database/index.js').db;

module.exports = {

  getReviews: () => {
  },

  reportReview: (id) => {
    var query = `UPDATE reviews SET reported=true WHERE review_id = ${id};`;

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

// UPDATE reviews SET reported=true WHERE review_id = 20;