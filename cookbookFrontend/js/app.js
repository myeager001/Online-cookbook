var app = angular.module('onlineCookbook', ['ngRoute', 'ngStorage'])
app.config(function($routeProvider, $httpProvider){
  $routeProvider.when('/', {
    templateUrl: 'partials/landing.html',
    controller: 'MainController'
  })
  .when('/home', {
    templateUrl: 'partials/home.html',
    controller: 'ContentController'
  })
  .otherwise({redirectTo :'/'})

  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
     return {
         'request': function (config) {
             config.headers = config.headers || {};
             if ($localStorage.token) {
                 config.headers.token = $localStorage.token;
             }
             return config;
         },
         'responseError': function (response) {
             if (response.status === 401 || response.status === 403) {
                 $location.path('/');
             }
             return $q.reject(response);
         }
     };
  }]);

});
