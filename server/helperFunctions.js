module.exports = {

  sortMetaData: (data, id) => {
    // sort data and organize it to how the client expects it
    console.log('data in helper', data)
    var result = {};
    result.product_id = id.toString();
    result.ratings = {};
    for (var i = 0; i < data.ratings.length; i++) {
      var key1 = data.ratings[i].rating;
      var value1 = data.ratings[i]['count(*)'];
      result.ratings[key1] = value1;
    }
    result.recommended = {};
    for (var i = 0; i < data.recommended.length; i++) {
      var key2 = data.recommended[i].recommend;
      var value2 = data.recommended[i]['COUNT(*)'];
      result.recommended[key2] = value2;
    }
    result.characteristics = {};

    for (var i = 0; i < data.characteristics.length; i++) {
      var charName = data.characteristics[i].name;
      var charID = data.characteristics[i].id;
      var charValue = data.characteristics[i].value;
      result.characteristics[charName] = {
        'id': charID,
        'value': charValue
      }
    }
    // result.characteristics = data.characteristics;

    return result;
  }
}