angular.module('booksapp', [])
.controller('books', function($scope, $http) {
 // Initialize variables
 $http.get('/books').then(function(response){
    console.log(response);
    $scope.booklist = response;
})
})

