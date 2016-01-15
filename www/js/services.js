angular.module('starter.services', [])
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
        node_id: data.nid.length ? data.nid[0].value : '',
        location: data.field_location.length ? data.field_location[0].value : '',
        title: data.title.length ? data.title[0].value : '',
        summary: data.field_summary.length ? data.field_summary[0].value : '',
        photo_url: data.field_cover_photo.length ? data.field_cover_photo[0].url : '',
        uuid: data.uuid.length ? data.uuid[0].value : '',
        description: data.body.length ? data.body[0].value : ''
      };

    }).select('title').value(); 
  }

  function all() {
    return cache('experiments', function() {
      return $http.get('/pantheon/experiments.json').then(parseResult)
    });
  }

  return {
    all: all
  };
})

.service('feature', function($http, cache) {
  function parseResult(response) {
    return {
      title: response.data[0].title[0].value,
      summary: response.data[0].field_summary[0].value,
      photo_url: response.data[0].field_cover_photo[0].url,
      uuid: response.data[0].uuid[0].value
    };
  }

  function get() {
    return cache('feature', function() {
      return $http.get('/pantheon/featured/experiments.json').then(parseResult);
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
        node_id: data.nid.length ? data.nid[0].value : '',
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
  };

  return {
    all: all
  };
});
