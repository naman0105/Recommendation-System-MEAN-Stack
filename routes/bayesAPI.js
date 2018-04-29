
var trainningData = [{user_name:"san", book_list:["book1","book2","book3"]},
{user_name:"san", book_list:["book1","book4","book3"]},
{user_name:"san",book_list:["book1","book2"]},
{user_name:"san", book_list:["book1","book2","book3", "book7","book9"]},
{user_name:"san", book_list:["book1","book2","book3"]},
{user_name:"san", book_list:["book1","book20"]},
{user_name:"san", book_list:["book1","book12","book13","book14","book2","book6","book5"]}
];

var bayesClassifier = function() {
   this.uniqueDictionary = {};
   this.reverseDictionary = {};
   this.uniqueCounter = 0;
   this.noRows = 0;
   this.noColumns = 0;
   this.booksList = [];
   this.predictionDictionary = {};
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


  console.log("probab:"+JSON.stringify(this.predictionDictionary));



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



var bayes = new bayesClassifier();
bayes.setClassifer(trainningData);
bayes.classify(["book1","book2"]);
module.exports = bayes;
