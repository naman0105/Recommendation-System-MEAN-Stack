var mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"
var assert = require('assert');

var mongoClass = function() {
  ;
}

mongoClass.prototype.insertOneData = function(insertJsonObject){
  mongo.connect(url,function(err,db){
    var dbo = db.db("books");
    dbo.collection("users").insertOne(insertJsonObject, function(err, res) {
    if (err)
      throw err;
    console.log("1 user inserted");
    db.close();
    });
  })
}

mongoClass.prototype.displayData = function(){
  mongo.connect(url,function(err,db){
    var dbo = db.db("books");
    dbo.collection("users").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  })
}

var mongoObject = new mongoClass();

module.exports = mongoObject;