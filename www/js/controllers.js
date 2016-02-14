angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $cordovaOauth) {
  var consumerKey = 'ZQZChwKji7NapGAxQyPzhqrH7';
  var consumerSecretKey = 'Nu3ks3ln8jH7YyPm2QDuGqbz52ImrktbsyORjSLjeDu8AFXdys';

  $scope.logged_in = false;
  $scope.login = function() {
    $cordovaOauth.twitter(consumerKey, consumerSecretKey).then(function(result) {
      $scope.logged_in = true;
      $scope.screen_name = result.screen_name
    }, function(error) {
    });
  };
})

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
