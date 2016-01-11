angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $http, featured, policies) {
  $scope.featured = featured;

  policies.all().then(function(response) {
    $scope.policies = response;
  });
})

.controller('PolicyCtrl', function($scope, policy) {
  $scope.policy = policy;
})

.controller('SearchCtrl', function($scope) {})

.controller('NewsCtrl', function($scope) {});
