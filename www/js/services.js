angular.module('starter.services', [])

.service('experiments', function($http) {
  function all() {
    return $http.get('/pantheon/experiments.json').then(function(response) {
      return _.map(response.data, function(data) {
        return {
          title: data.title[0].value,
          summary: data.field_summary[0].value,
          photo_url: data.field_cover_photo[0].url
        };
      });
    });
  }

  return {
    all: all
  };
})

.service('feature', function($http) {
  function get() {
    return $http.get('/pantheon/featured/experiments.json').then(function(response) {
      return {
        title: response.data[0].title[0].value,
        summary: response.data[0].field_summary[0].value,
        photo_url: response.data[0].field_cover_photo[0].url
      };
    });
  }

  return {
    get: get
  };
})

.service('policies', function($http) {
  
  function all() {
    return $http.get('pantheon/policies.json').then(function(response) {
      return _.map(response.data, function(data) {
        return {
          title: data.title[0].value,
          uuid: data.uuid[0].value,
          description: data.body[0].value
        };
      });
    });
  };

  return {
    all: all
  };
});
