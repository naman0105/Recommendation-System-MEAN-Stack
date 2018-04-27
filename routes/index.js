var express = require('express');
var router = express.Router();
var path = require('path');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var app = express();
app.use(express.static('public'));


var url = "mongodb://localhost:27017/"

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/book', (req, res) => {
  res.sendFile(path.resolve('public/book.html'));
})

router.get('/api', (req, res) => {
  res.status(200).send({message: 'Hello World!'})
});



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

module.exports = router;
