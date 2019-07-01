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
  console.log($scope.selected_planets);

  $scope.vehical = [];
  $http({
    method: 'GET',
    url: 'https://findfalcone.herokuapp.com/vehicles'
  }).then(function successCallback(response) {
    $scope.data = response.data;
    $scope.loaded = true;
    for (var i = 0; i < $scope.data.length; i++) {
      $scope.vehical.push($scope.data[i]);
      $scope.vehical[i].selected = false;
    }
  }, function errorCallback(response) {
    document.write('<h1 style="text-align:center">Something was not Found Error:404!!</h1>');
  });
  console.log($scope.vehical, '000000000000');

  $scope.drag = function(idx, name) {
    console.log("vehical---", idx, name);
    if ($scope.vehical[idx].total_no != 0) {
      $scope.vehical[idx].total_no -= 1;
    }
  }

$scope.dragthis =  function(event) {
    console.log('draggggingg');
    event.dataTransfer.setData("Text", event.target.id);
  }


  $scope.dragging = function(event) {
    console.log("The p element is being dragged");
  }

  $scope.allowDrop = function(event) {
    event.preventDefault();
  }

  $scope.drop = function(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    event.target.appendChild(document.getElementById(data));
    console.log("The p element was dropped");
  }
});
