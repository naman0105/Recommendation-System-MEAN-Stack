var mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"
var assert = require('assert');

var mongoClass = function() {
  ;
}


mongoClass.prototype.insertOnePurchaseData = function(insertJsonObject){
  mongo.connect(url,function(err,db){
    var dbo = db.db("books");
    dbo.collection("user_books").insertOne(insertJsonObject, function(err, res) {
    if (err)
      throw err;
    console.log("1 user inserted");
    db.close();
    });
  })
}

mongoClass.prototype.displayPurchaseData = function(){
  mongo.connect(url,function(err,db){
    var dbo = db.db("books");
    dbo.collection("user_books").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  })
}

var mongoObject = new mongoClass();

module.exports = mongoObject;
