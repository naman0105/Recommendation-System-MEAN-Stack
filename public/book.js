angular.module('booksapp', [])
.controller('books', function($scope, $http) {
 // Initialize variables
  $scope.books = []
  $scope.buybookmessage = "";
  $scope.removeBook = function(name){
    var index = $scope.books.indexOf(name);
    $scope.books.splice(index, 1); 
  }
  $scope.addBookName = function(name){
    $scope.books.push(name);
    var data = {
      user_name : $scope.userName,
      book_list : $scope.books
    }
    console.log($scope.books)
    $http.post('/bookRecommendations',data).then(function(response){
      console.log("books recommendations");
      console.log(response);
    })
  }
  $scope.insertDatabase = function(){
    var data = {
      user_name : $scope.userName,
      book_list : $scope.books
    }
    $http.post('/insertUserAndBooks',data).then(function(response){
      console.log("successfull insertion of user and books")
    })
    $scope.books = []
    $scope.buybookmessage = "Thank you for buying books at bookstore"
  }
  $http.get('/books').then(function(response){
      console.log(response);
      $scope.booklist = response;
      $scope.userName = getCookie("user");
  })
})

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
