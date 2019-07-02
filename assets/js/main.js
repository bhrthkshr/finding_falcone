var app = angular.module("Finding_Falcone", ["ngRoute", "ngDraggable"]);
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

app.controller("planet.controller", function($scope, $http, $rootScope) {
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
  console.log($scope.planets, '------------');

  $rootScope.selected_planets = [];
  $scope.limit_exceed = false;


  $scope.select = function(idx) {
    if (!$scope.planets[idx].selected) {
      $scope.planets[idx].selected = true;

      if ($scope.selected_planets.length <= 3) {
        $scope.selected_planets.push($scope.planets[idx]);
        $scope.limit_exceed = false;
      } else {
        $scope.planets[idx].selected = false;
        $scope.limit_exceed = true;
      }

    } else {
      $scope.selected_planets.pop($scope.planets[idx]);
      $scope.planets[idx].selected = false;
    }
  }

  $scope.reset = function() {
    for (var i = 0; i < $scope.planets.length; i++) {
      if ($scope.planets[i].selected) {
        $scope.planets[i].selected = false;
      }
    }
    $scope.selected_planets = [];
    $scope.limit_exceed = false;
  }
});

app.controller("vehical.controller", function($scope, $http) {
  $scope.selected_planet = $scope.selected_planets;
  if ($scope.selected_planet) {
    for (var i = 0; i < $scope.selected_planet.length; i++) {
      $scope.selected_planet[i].vehical = [];
    }
    $scope.vehicals = [];
    $http({
      method: 'GET',
      url: 'https://findfalcone.herokuapp.com/vehicles'
    }).then(function successCallback(response) {
      $scope.data = response.data;
      $scope.loaded = true;
      for (var i = 0; i < $scope.data.length; i++) {
        $scope.vehicals.push($scope.data[i]);
      }
    }, function errorCallback(response) {
      document.write('<h1 style="text-align:center">Something was not Found Error:404!!</h1>');
    });
  } else {
    $scope.loaded = true;
    console.log('planets got cleared or was not loaded');
  }

  $scope.onDropComplete = function(data, evt, newState) {
    console.log("drop complete");
    if (data.total_no != 0) {
      $scope.check_distance(data, newState);
    }
    if (data.total_no == 0) {
      var pos = $scope.vehicals.map(function(e) {
        return e.name;
      }).indexOf(data.name);
      $scope.vehicals.splice(pos, 1);
    }
  }

  $scope.check_distance = function(veh, idx) {
    // console.log("came to check distance of ", veh.name, 'in planet', idx);
    if (veh.max_distance >= $scope.selected_planet[idx].distance) {
      $scope.selected_planet[idx].vehical=[veh];
      return veh.total_no -= 1
    }
    // else {
    //   console.log('cannot got to this planet with this shit');
    // }
  }

  $scope.undo_vehical = function(vInfo,idx) {
    console.log(vInfo,'------came back after removing');
    $scope.vehicals.push(vInfo);
    $scope.selected_planet[idx].vehical.splice(0,1);
    console.log($scope.selected_planet[idx]);
  }




});
