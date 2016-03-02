var app = angular.module('popup', ['ngTagsInput'])
app.controller('MainController', ['$scope', '$http', '$window', function(scope, http, $window){
  scope.recipe={}
  scope.recipe.tags = [];
  scope.recipe.name;
  scope.success = false;
  scope.done = function(){
    window.close();
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
            http.post('http://localhost:3000/home/56bccb5022509b854aab475c', results).then(function(results){
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
