var app = angular.module('popup', ['ngTagsInput', 'ngRoute'])
app.controller('MainController', ['$scope', '$http', '$window', '$location',function(scope, http, $window, location){
  console.log('in Main');
  scope.recipe={}
  scope.recipe.tags = [];
  scope.recipe.name;
  scope.success = false;
  scope.done = function(){
    window.close();
  }
  scope.logOut = function(){
    chrome.storage.local.clear();
    location.path('/');
  }
  scope.redirect = function(){
    $window.open('http://localhost:3333/#/home')
    window.close();
  }
  scope.sendResults = function(results){
    if(scope.recipe.name ){
      if(scope.recipe.tags.length<=3){
          chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            results.url = tabs[0].url;
            http.post('http://localhost:3000/home/', results).then(function(results){
              if(results.data.success){
                scope.success = true;
              }
              else{
                scope.error = results.data.message
              }

            });
          });
      }else{
        scope.error = "Maximum number of tags is 3"
      }
    }else{
      scope.error = "invalid recipe name"
    }
  }
}])
app.controller('SigninController', ['$scope', '$http', '$location',function(scope, http, location){
  console.log('in signin');
  chrome.storage.local.get('token', function(token){
    if(token.token){
      location.path('/home')
    }
  });
  scope.loginCall = function(packet) {
    http.post('http://localhost:3000/auth/login', packet).then(function(results){
      console.log(results);
      if(results.data.success){
        results.data.token;
        chrome.storage.local.set({'token': results.data.token});
        location.path('/home')
      }else{
        scope.loginMessage = results.data.message
      }
    })
  }
}])
app.config(function($routeProvider, $httpProvider){
  $routeProvider.when('/home', {
    templateUrl: 'partials/home.html',
    controller: 'MainController'
  })
  .when('/', {
    templateUrl: 'partials/signin.html',
    controller: 'SigninController'
  })
  .otherwise({redirectTo :'/'})

  $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
     return {
         'request': function (config) {
            config.headers = config.headers || {};
            return $q(function (resolve, reject){
              chrome.storage.local.get('token', function(token){
                console.log('config', config);
                if(token){
                  console.log(token)
                  console.log('geting token!')
                  config.headers.token = token.token;
                  resolve(config);
                }else{
                  resolve(config);
                }
              })
            })


         },
         'responseError': function (response) {
             if (response.status === 401 || response.status === 403) {
                 $location.path('/signin');
             }
             return $q.reject(response);
         }
     };
  }]);

});
