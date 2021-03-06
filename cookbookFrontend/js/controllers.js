app.controller('MainController', ['$scope', '$http', '$location', '$localStorage', function(scope, http, location, localStorage){
  http.get('http://localhost:3000/home/').then(function(results){
    if(results.data._id){
      location.path('/home');
    }

  })
  scope.login = false
  scope.signUp = false
  scope.signupCall = function(packet) {
    http.post('http://localhost:3000/auth/signup', packet).then(function(results){
      console.log(results);
      scope.signupMessage = results.data.message
    })
  }
  scope.loginCall = function(packet) {
    http.post('http://localhost:3000/auth/login', packet).then(function(results){
      console.log(results)
      if(results.data.success){
        localStorage.token = results.data.token
        location.path('/home')
      }else{
        scope.loginMessage = results.data.message
      }
    })
  }
}])
app.controller('ContentController', ['$scope', '$http', '$location', '$localStorage', function(scope, http, location, localStorage){
  http.get('http://localhost:3000/home').then(function(results){
    console.log(results.data);
    scope.user = {}
    scope.user = results.data;
    console.log(scope.user);
  })
  scope.go = function(url){
    window.location.assign(url)
  }
  scope.toggleFav = function(recipe){
    recipe.favorite = !recipe.favorite
    http.put('http://localhost:3000/home/updatefavorite', recipe).then(function(results){
      console.log(results.data)
    })
  }
  scope.modalShown = false;
  scope.toggleModal = function(recipe) {
    scope.selectedRecipe = recipe;
    scope.modalShown = !scope.modalShown;
  };
  scope.filterFavsOn = false;
  scope.filters = {}
  scope.filterFavs = function(){
    scope.filterFavsOn = true;
    scope.filters.favorite = true;
  }
  scope.removeFilters = function(){
    scope.filters = {};
    scope.filterFavsOn = false;
  }
  scope.logOut = function(){
    localStorage.$reset();
    location.path('/');
  }
  scope.removeRecipe = function(){
    scope.modalShown = !scope.modalShown;
    console.log(scope.selectedRecipe);
    http.delete('http://localhost:3000/home/'+scope.selectedRecipe.name).then(function(results){
      console.log('done');
    })
  }
}])
