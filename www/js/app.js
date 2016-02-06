angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angularMoment'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.campaign', {
    url: '/campaigns/:id',
    resolve: {
      campaign: function($stateParams, campaigns, places) {
        return campaigns.find($stateParams.id).then(function(campaign) {
          return places.find(campaign.place_id).then(function(place) {
            campaign.place = place;
            return campaign
          });
        });
      }
    },
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-campaign.html',
        controller: 'CampaignCtrl'
      }
    }
  })

  .state('tab.issue', {
    resolve: {
      issue: function($stateParams, $q, issues, campaigns, places) {
        return $q(function(resolve, reject) {
          $q.all([
            issues.find($stateParams.id),
            campaigns.for_issue($stateParams.id)
          ]).then(function(results) {
            var issue = results[0];
            issue.campaigns = results[1];

            $q.all(_.map(issue.campaigns, function(campaign) {
              return places.find(campaign.place_id).then(function(place) {
                campaign.place =  place;
              });
            })).then(function() {
              resolve(issue);
            });
          });
        });
      }
    },
    url: '/issues/:id',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-issue.html',
        controller: 'IssueCtrl'
      }
    }
  })

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('tab.news', {
    url: '/news',
    views: {
      'tab-news': {
        templateUrl: 'templates/tab-news.html',
        controller: 'NewsCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/tab/home');

});
