angular.module('booksapp', [])
.controller('books', function($scope, $http) {
 // Initialize variables
 $scope.key = 'fds';
 this.name2 = '';
 $scope.greeting1 = `Hello ${$scope.name1}`;
 this.greeting2 = `Hi ${this.name2}`;
 $http.get('/books').then(function(response){
    console.log(response);
    $scope.booklist = response;
})
})
