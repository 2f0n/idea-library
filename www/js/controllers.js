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

.controller('CampaignCtrl', function($scope, $location, campaign, twitter) {
  $scope.campaign = campaign;

  twitter.search(campaign.title).then(function(result) {
    $scope.tweets = result;
  });

  $scope.go = function(path) {
    $location.path(path);
  };
})

.controller('PlaceCtrl', function($scope, $location, place) {
  $scope.place = place;

  $scope.go = function(path) {
    $location.path(path);
  };
})

.controller('SearchCtrl', function($scope) {})

.controller('NewsCtrl', function($scope) {});
