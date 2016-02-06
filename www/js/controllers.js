angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $location, $http, issues) {
  issues.all().then(function(response) {
    $scope.issues = response;
  });

  $scope.go = function(path) {
    $location.path(path);
  };
})

.controller('IssueCtrl', function($scope, $location, issue) {
  $scope.issue = issue;

  $scope.go = function(path) {
    $location.path(path);
  };
})

.controller('CampaignCtrl', function($scope, campaign) {
  $scope.campaign = campaign;
})

.controller('SearchCtrl', function($scope) {})

.controller('NewsCtrl', function($scope) {});
