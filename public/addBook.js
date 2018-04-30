angular.module('addBookApp', [])
.controller('addBook', function($scope, $http) {
 // Initialize variables
 var data;

 $scope.submit= function(){
     console.log("inside the submit function")
     data = {
            book_name: $scope.book_name,
            author_name : $scope.author_name,
            price : $scope.price,
            pages : $scope.pages,
            category : $scope.category
      }
    //   data = $.param({
    //   book: JSON.stringify({
    //       book_name: $scope.book_name,
    //       author_name : $scope.author_name,
    //       price : $scope.price,
    //       pages : $scope.pages,
    //       category : $scope.category
    //     })
    // });
    console.log(data)
    $http.post('/addBookData',data).then(function(success){
         console.log("sending successfull");
    });
  window.location.href = "/";
  }
})

