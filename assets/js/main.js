var app = angular.module("Finding_Falcone", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "templates/intro.html",
      controller: "main.controller",
    })
    .when("/planets", {
      templateUrl: "templates/planets.html",
      controller: "planet.controller",
    })
    .when("/vehicals", {
      templateUrl: "templates/vehicals.html",
      controller: "vehical.controller",
    })
    .when("/result", {
      templateUrl: "templates/result.html",
      controller: "result.controller",
    });

});

app.controller("main.controller", function($scope, $http) {
  console.log("main_controller");
});

app.controller("planet.controller", function($scope, $http) {
  console.log('plannnnnnnnnneeeee');
  $scope.loaded = false;
  $scope.planets = [];
  $http({
    method: 'GET',
    url: 'https://findfalcone.herokuapp.com/planets'
  }).then(function successCallback(response) {
    $scope.data = response.data;
    $scope.loaded = true;
    for (var i = 0; i < $scope.data.length; i++) {
      $scope.planets.push($scope.data[i]);
      $scope.planets[i].selected = false;
    }
  }, function errorCallback(response) {
    document.write('<h1 style="text-align:center">Something was not Found Error:404!!</h1>');
  });
  // console.log($scope.planets);
  $scope.selected_planets = [];
  $scope.limit_exceed = false;


  $scope.select = function(idx) {
    if (!$scope.planets[idx].selected) {
      $scope.planets[idx].selected = true;
      if ($scope.selected_planets.length <= 3) {
        $scope.selected_planets.push($scope.planets[idx]);
        // console.log( "pushing  ------",idx+1, $scope.planets[idx].name);
      } else {
        $scope.planets[idx].selected = false;
        $scope.limit_exceed = true;
        // console.log("reached max limit",$scope.selected_planets.length);
      }
    } else {
      $scope.planets[idx].selected = false;
      $scope.selected_planets.pop($scope.planets[idx]);
      $scope.limit_exceed = false;
      // console.log("popped and removed color of",idx+1,$scope.planets[idx].name);
    }
  }

  $scope.reset = function() {
    for (var i = 0; i < $scope.planets.length; i++) {
      if ($scope.planets[i].selected) {
        $scope.planets[i].selected = false;
      }
    }
    $scope.selected_planets = [];
  }
});
