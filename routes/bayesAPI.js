var mongoAPI = require('./mongoDBAPI');

// var trainningData = [{user_name:"san", book_list:["book1","book2","book3"]},
// {user_name:"san", book_list:["book1","book4","book3"]},
// {user_name:"san",book_list:["book1","book2"]},
// {user_name:"san", book_list:["book1","book2","book3", "book7","book9"]},
// {user_name:"san", book_list:["book1","book2","book3"]},
// {user_name:"san", book_list:["book1","book20"]},
// {user_name:"san", book_list:["book1","book12","book13","book14","book2","book6","book5"]}
// ];


var bayesClassifier = function() {
   this.uniqueDictionary = {};
   this.reverseDictionary = {};
   this.uniqueCounter = 0;
   this.noRows = 0;
   this.noColumns = 0;
   this.booksList = [];
   this.predictionDictionary = {};
   this.sendBackList = [];
}


bayesClassifier.prototype.setClassifer = function (trainningData){
  this.noOfRows = trainningData.length;
  this.noColumns = this.getColumns(trainningData);
  this.bayesMatrix = this.create2DMatrix(this.noOfRows, this.noColumns, 0);

  this.matrixEntry(trainningData);
}

bayesClassifier.prototype.getColumns = function (trainningData){
  for(var i = 0; i < this.noOfRows; i++)
  {
    for(var j = 0;j < trainningData[i].book_list.length; j++)
    {

        if(this.uniqueDictionary[trainningData[i].book_list[j]] == undefined)
        {
          this.uniqueDictionary[trainningData[i].book_list[j]] = this.uniqueCounter;
          this.reverseDictionary[this.uniqueCounter] = trainningData[i].book_list[j];
          this.booksList.push(trainningData[i].book_list[j]);
          this.uniqueCounter += 1;
        }

    }

  }
  console.log(JSON.stringify(this.uniqueDictionary));
  console.log(JSON.stringify(this.reverseDictionary));
  return this.uniqueCounter;


}


bayesClassifier.prototype.create2DMatrix = function (rows, cols, defaultValue){

    var arr = [];

    // Creates all lines:
    for(var i=0; i < rows; i++){

        // Creates an empty line
        arr.push([]);

        // Adds cols to the empty line:
        arr[i].push(new Array(cols));

        for(var j=0; j < cols; j++){
          // Initializes:
          arr[i][j] = defaultValue;
        }
    }

  return arr;
  }


bayesClassifier.prototype.matrixEntry = function (trainningData){

  for(var i = 0; i < this.noOfRows; i++)
  {
    for(var j = 0; j < trainningData[i].book_list.length; j++)
    {
        this.bayesMatrix[i][this.uniqueDictionary[trainningData[i].book_list[j]]] = 1;

    }
  }
  console.log(this.bayesMatrix);

}

bayesClassifier.prototype.classify = function (evidence){

  var evidencePriorProduct = 1;
  var hypothPriorProbab = 1;
  var conditionalProbabProd = 1;
  var posteriorProbab = 1;
  this.predictionDictionary = {};
  console.log("evidence is"+evidence);

  for(var i = 0; i < evidence.length; i++)
  {
    evidencePriorProduct *= this.priorProbability(evidence[i]);
  }

  for(var i = 0; i < this.booksList.length; i++)
  {
    conditionalProbabProd = 1;
    if(evidence.indexOf(this.booksList[i]) == -1)
    {
        var hypothesis = this.booksList[i];
        console.log(hypothesis);
        hypothPriorProbab = this.priorProbability(hypothesis);
        for(var j = 0; j < evidence.length; j++)
        {
          conditionalProbabProd *= this.conditionalProbability(evidence[j], hypothesis);
        }
        posteriorProbab = (conditionalProbabProd*hypothPriorProbab)/evidencePriorProduct;
        this.predictionDictionary[hypothesis] = posteriorProbab;
    }

  }

  this.sendBackList = this.getBest3Books();
  console.log("sending results:" + this.sendBackList);
  console.log("probab:"+JSON.stringify(this.predictionDictionary));

  return this.sendBackList;


}

bayesClassifier.prototype.conditionalProbability = function (a, b){
  var hypoIndex = this.uniqueDictionary[a];
  var evidenceIndex = this.uniqueDictionary[b];
  var positiveCase = 0;
  var totalCase = 0;
  for(var i = 0; i < this.noOfRows; i++)
  {
    if(this.bayesMatrix[i][evidenceIndex] == 1)
    {
      if(this.bayesMatrix[i][hypoIndex] == 1)
      {
        positiveCase += 1;
      }
      totalCase += 1;
    }

  }

  var probability = positiveCase / totalCase;
  return probability;
}

bayesClassifier.prototype.priorProbability = function (a){
  var matrixIndex = this.uniqueDictionary[a];
  var positiveCase = 0;
  var totalCase = 0;
  for(var i = 0; i < this.noOfRows; i++)
  {
    if(this.bayesMatrix[i][matrixIndex] == 1)
      positiveCase += 1;
    totalCase += 1;
  }
  var probability = positiveCase / totalCase;
  return probability;

}

bayesClassifier.prototype.getBest3Books = function (N = 3){
  var books = Object.keys(this.predictionDictionary);
  var bestList = [];
  console.log("books pref before:" + books);
  var sendBackList = [];
  for(var i = 0; i < books.length - 1; i++)
  {
    for(var j = 0; j < books.length - i - 1; j++)
    {
      console.log(this.predictionDictionary[books[j]]);
      if(this.predictionDictionary[books[j]] < this.predictionDictionary[books[j+1]])
      {
        var temp = books[j];
        books[j] = books[j+1];
        books[j+1] = temp;
      }
    }
  }
  console.log("books pref after:" + books);
  for(var i = 0; i < N; i++)
  {
    bestList.push(books[i]);
  }
  return bestList;

}




var bayes = new bayesClassifier();
// bayes.setClassifer(trainningData);
// bayes.classify(["book1", "book2"]);
module.exports = bayes;
