'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'taskServices'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'AuthCtrl'});
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/tasks', {templateUrl: 'partials/tasks.html', controller: 'TaskCtrl'});
  $routeProvider.otherwise({redirectTo: '/tasks'});
}]).
factory('restInterceptor', function($cookieStore, $window){

    return {
        request: function (config) {
            // only send auth token with rest requests:
            if (config.url.indexOf('api') === 0) {
                var token = $cookieStore.get("auth");
                config.headers = config.headers || {};
                config.headers['X-Auth-Token'] = token;
                config.headers['Accept'] = 'application/json';
            }
            return config;
        }
    }
}).
config(
    ['$httpProvider', function ($httpProvider) {

      function securityInterceptor($location, $q) {
          return function(promise) {
              return promise.then(null, function(response) {
                if(response.status === 403) {
                  console.log("server returned authorization error");
                  $location.path('/login');
                }
              return $q.reject(response);
            });
          };
      }
      $httpProvider.responseInterceptors.push(securityInterceptor);

      $httpProvider.interceptors.push('restInterceptor');
}]);
