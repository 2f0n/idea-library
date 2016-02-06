angular.module('starter.services', [])
.service('twitter', function($q) {

  function search(query) {
    return $q(function(resolve, reject) {
      var twitter_api_results = [
        {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          user: { name: "Charlie", screen_name: "charlie255" },
          created_at: "1/8/2014"
        },
        {
          text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.",
          user: { name: "Edward", screen_name: "100bestEddie" },
          created_at: "8/1/2015"
        }
      ];

      var tweets = _.map(twitter_api_results, function(status) {
        return {
          text: status.text,
          name: status.user.name,
          handle: status.user.screen_name,
          date: status.created_at
        }
      });

      resolve(tweets);
    });
  }

  return {
    search: search
  };
})

.service('cache', function($q) {
  var cache = function() {
    var cached_data = {};

    return function(id, fn_cache_this) {
      if(cached_data[id])
        return cached_data[id];

      if(fn_cache_this) {
        var result = fn_cache_this();
        cached_data[id] = result;
      }

      return cached_data[id];
    };
  }();

  return cache;
})

.service('places', function($http, cache) {
  function parseResult(response) {
    return _.chain(response.data).map(function(data) {
      return {
        id: data.nid[0].value,
        title: data.title[0].value
      };

    }).select('title').value();
  }

  function all() {
    return cache('places', function() {
      return $http.get('/v1/places').then(parseResult)
    });
  }

  function find(id) {
    return cache('place_' + id, function() {
      return $http.get('/v1/place/' + id).then(function(result) {
        return parseResult(result)[0];
      });
    });
  }

  function where(params) {
    return all().then(function(records) {
      return _.where(records, params);
    });
  }

  return {
    all: all,
    find: find,
    where: where
  };
})

.service('campaigns', function($http, cache) {
  function parseResult(response) {
    return _.chain(response.data).map(function(data) {
      return {
        id: data.nid[0].value,
        title: data.title[0].value,
        photo: data.field_cover_photo[0].url,
        place_id: data.field_place[0].target_id,
        hashtag: data.field_primary_hashtag[0].value
      };

    }).select('title').value();
  }

  function all() {
    return cache('campaigns', function() {
      return $http.get('/v1/campaigns').then(parseResult)
    });
  }

  function find(id) {
    return cache('campaign_' + id, function() {
      return $http.get('/v1/campaign/' + id).then(parseResult).then(function(campaigns) {
        return campaigns[0];
      });
    });
  }

  function where(params) {
    return all().then(function(records) {
      return _.where(records, params);
    });
  }

  function for_issue(issue_id) {
    return cache('issues_' + issue_id, function() {
      return $http.get('/v1/issue/'+issue_id+'/campaigns').then(parseResult)
    });
  }

  function for_place(place_id) {
    return cache('campaigns_for_place_' + place_id, function() {
      return $http.get('/v1/place/'+place_id+'/campaigns').then(parseResult);
    });
  }

  return {
    all: all,
    where: where,
    for_issue: for_issue,
    for_place: for_place,
    find: find
  };
})

.service('issues', function($http, cache) {
  function parseResult(response) {
    return _.map(response.data, function(data) {
      return {
        id: data.nid[0].value,
        title: data.title[0].value,
        uuid: data.uuid[0].value,

      };
    });
  }

  function all() {
    return cache('issues', function() {
      return $http.get('/v1/issues').then(parseResult);
    });
  }

  function find(issue_id) {
    return all().then(function(policies) {
      return _.find(policies, { id: issue_id });
    });
  }

  return {
    all: all,
    find: find
  };
});
