angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $http, featured, policies, experiments) {
  $scope.featured = featured;

  policies.all().then(function(response) {
    $scope.policies = response;
  });
})

.controller('ExperimentCtrl', function($scope, experiment) {
  $scope.experiment = experiment;
})

.controller('PolicyCtrl', function($scope, policy) {
  $scope.policy = policy;
})

.controller('SearchCtrl', function($scope) {})

.controller('NewsCtrl', function($scope) {});
