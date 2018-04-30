var express = require('express');
var router = express.Router();
var path = require('path');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser')

var bayesAPI = require('./bayesAPI');
var mongoAPI = require('./mongoDBAPI');
var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var url = "mongodb://localhost:27017/"

router.get('/', (req, res) => {
  res.sendFile(path.resolve('public/book.html'));
})

router.get('/books', function (req, res) {
  var data;
  mongo.connect(url,function(err,db){
      assert.equal(null,err);
      var dbo = db.db("books");
      dbo.collection('book_list').find({}).toArray(function(err, result){
          if(err) throw err;
          console.log(result);
          data = result;
          db.close();
          res.send(JSON.stringify(data));
      }
  );
  })
})

router.get('/addBook', function (req, res) {
  res.sendFile(path.resolve('public/addBook.html'));
})

router.post('/addBookData', function(req, res){
  var data;
  console.log(req.body);
  data = req.body;
  mongo.connect(url,function(err,db){
      assert.equal(null,err);
      var dbo = db.db("books");
      dbo.collection("book_list").insertOne(data, function(err, res) {
        if (err) throw err;
        console.log("1 book inserted");
        db.close();
      });
  })
})

router.get('/login', function (req, res) {
  //req.session.userName=myDet["emailId"];
  res.sendFile(path.resolve('public/login.html'));

});

router.get('/userProfile', function (req, res) {
  //req.session.userName=myDet["emailId"];
  res.sendFile(path.resolve('public/userProfile.html'));
});

router.get('/loginuser', function(req,res){
      console.log("from the back-end" + req.query.name);
      data = { name : req.query.name, books : [] }
      console.log(JSON.stringify(data))
});

router.post('/insertUserAndBooks',function(req,res){
  console.log(req.body);
  var data = req.body;
  mongoAPI.insertOnePurchaseData(data);
  mongoAPI.displayPurchaseData();
})

router.post('/bookRecommendations', function(req, res){
  console.log("from book recommendations");
  console.log(req.body);
  var trainningData;
  var callback = function(result){
    trainningData = result;
    console.log("the training datq " + trainningData)
    bayesAPI.setClassifer(trainningData);
    console.log(" Comming from the classifier "+bayesAPI.classify(req.body)); 
  }
  mongoAPI.displayPurchaseData(callback);
})
module.exports = router;
