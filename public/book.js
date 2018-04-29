angular.module('booksapp', [])
.controller('books', function($scope, $http) {
 // Initialize variables
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
