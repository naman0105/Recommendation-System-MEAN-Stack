angular.module('loginApp', [])
.controller('login', function($scope, $http) {
 // Initialize variables
 var data;

 $scope.submit= function(){
   document.cookie = "user = "+$scope.userName;
   console.log("Hello "+document.cookie);
    $http.get('/loginuser?name='+$scope.userName).then(function(success){
         console.log("sending successfull");
    });
    window.location.href = "/userProfile";

  }
})
