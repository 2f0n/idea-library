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

.service('experiments', function($http, cache) {
  function parseResult(response) {
    return _.chain(response.data).map(function(data) {
      return {
        policy_id: data.field_idea_model.length ? data.field_idea_model[0].target_id: '',
        node_id: data.nid.length ? data.nid[0].value : '',
        uuid: data.uuid.length ? data.uuid[0].value : '',

        start_date: data.field_start_date.length ? data.field_start_date[0].value : '',
        end_date: data.field_end_date.length ? data.field_end_date[0].value : '',
        is_ongoing: data.field_ongoing.length ? data.field_ongoing[0].value == "1" : false,

        location: data.field_location.length ? data.field_location[0].value : '',
        title: data.title.length ? data.title[0].value : '',
        summary: data.field_summary.length ? data.field_summary[0].value : '',
        photo_url: data.field_cover_photo.length ? data.field_cover_photo[0].url : '',
        description: data.body.length ? data.body[0].value : ''
      };

    }).select('title').value(); 
  }

  function all() {
    return cache('experiments', function() {
      return $http.get('/pantheon/experiments.json').then(parseResult)
    });
  }

  function where(params) {
    return all().then(function(experiments) {
      return _.where(experiments, params);
    });
  }

  return {
    all: all,
    where: where
  };
})

.service('feature', function($http, cache, policies) {
  function parseResult(response) {
    return {
      policy_id: response.data[0].field_idea_model[0].target_id,
      title: response.data[0].title[0].value,
      summary: response.data[0].field_summary[0].value,
      photo_url: response.data[0].field_cover_photo[0].url,
      uuid: response.data[0].uuid[0].value
    };
  }

  function get() {
    return cache('feature', function() {
      return $http.get('/pantheon/featured/experiments.json').then(function(result) {
        var experiment = parseResult(result);

        return policies.find(experiment.policy_id).then(function(policy) {
          experiment.policy = policy;
          return experiment;
        });

      });
    });
  }

  return {
    get: get
  };
})

.service('policies', function($http, cache) {
  function parseResult(response) {
    return _.map(response.data, function(data) {
      return {
        id: data.nid.length ? data.nid[0].value : '',
        title: data.title.length ? data.title[0].value : '',
        uuid: data.uuid.length ? data.uuid[0].value : '',
        description: data.body.length ? data.body[0].value : ''
      };
    });
  }

  function all() {
    return cache('policies', function() {
      return $http.get('pantheon/policies.json').then(parseResult);
    });
  }

  function find(policy_id) {
    return all().then(function(policies) {
      return _.find(policies, { id: policy_id });
    });
  }

  return {
    all: all,
    find: find
  };
});
