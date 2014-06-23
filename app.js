var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/school', function(err, db) {
    if(err) throw err;

    var students = db.collection('students');
    var cursor = students.find();

    cursor.each(function(err, doc) {
        if(err) throw err;
        if(doc == null) {
            return db.close();
        }

        var scores = doc.scores;
        scores.sort(compare);  // sort
        scores = removeLowestHomework(scores);
        // console.dir(scores) // remove lowest
        // update

        var updateDB = { $set: { 'scores': scores } };

        students.update({_id:doc._id}, updateDB, function(err, updatedDoc) {
          if (err) throw err;
          console.dir("successfully updated document", updatedDoc);
          db.close();
        });
    });

});

function compare(a, b) {
  if (a.score < b.score)
     return -1;
  if (a.score > b.score)
    return 1;
  return 0;
}

function removeLowestHomework(scores) {
  var results = [];
  var hasRemoved = false;
  scores.forEach(function (score) {
    // don't add the first homework score to result set
    if (hasRemoved != true && score.type == 'homework') {
      hasRemoved = true;
    } else {
      results.push(score);
    }
  });
  return results;
}
