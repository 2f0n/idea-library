angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $http, featured, policies) {
  $scope.featured = featured;

  policies.all().then(function(response) {
    $scope.policies = response;
  });
})

.controller('ExperimentCtrl', function($scope, experiment, policies) {
  $scope.experiment = experiment;
  policies.find(experiment.policy_id).then(function(policy) {
    $scope.policy = policy;
  });
})

.controller('PolicyCtrl', function($scope, policy, experiments) {
  $scope.policy = policy;

  experiments.where({ policy_id: policy.id }).then(function(relevant_experiments) {
    $scope.experiments = relevant_experiments;
  });
})

.controller('SearchCtrl', function($scope) {})

.controller('NewsCtrl', function($scope) {});
