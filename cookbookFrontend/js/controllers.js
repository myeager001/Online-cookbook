app.controller('MainController', ['$scope', '$http', '$location', '$localStorage', function(scope, http, location, localStorage){
  http.get('http://localhost:3000/home/56b1212dd86df5b18069cafe').then(function(results){
    console.log(results.data[0]);
    scope.user = results.data[0];
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
    this.recipe.favorite = !this.recipe.favorite
    http.put('http://localhost:3000/home/', recipe).then(function(results){
      console.log(results.data)
    })
  }
  scope.modalShown = false;
  scope.toggleModal = function() {
    scope.modalShown = !scope.modalShown;
  };
}])
