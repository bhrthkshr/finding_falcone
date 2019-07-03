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

  //-----temp with out internet
  // $scope.data = $scope.local_planets;
  // $scope.loaded = true;
  // for (var i = 0; i < $scope.data.length; i++) {
  //   $scope.planets.push($scope.data[i]);
  //   $scope.planets[i].selected = false;
  // }
  //-----------
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
  $scope.check_existence = function(value) {
    //to check if number of vehical is 0 or 1
    //to deal with vehicals more than 1
    var pos = $scope.vehicals.map(function(e) {
      return e.name;
    }).indexOf(value.name);
    console.log(pos, '----is the index value of vehical');
    return pos;
  }
  $scope.check_for_same_vehical = function(i, value) {
    //this checks for a vehical is already added to a planet
    console.log($scope.selected_planet[i].vehical, '------checking vehiii');
    var pos = $scope.selected_planet[i].vehical.map(function(e) {
      return e.name;
    }).indexOf(value.name);
    return pos;
  }

  $scope.onDropComplete = function(data, evt, newState) {
    console.log("drop complete");
    var same_data = $scope.check_for_same_vehical(newState, data);
    $scope.calc_time($scope.selected_planet[newState].distance,data.speed)
    if (same_data != -1) {
      console.log('sameeeeeeeeeeeee', data.name, "----", same_data);
    } else if (same_data == -1 && $scope.selected_planet[newState].vehical.length == 0) {
      console.log('issss diffreent');
      // console.log($scope.selected_planet[newState].vehical[0].name == 'undefined', '----in the planet ---old');
      if (data.total_no != 0) {
        console.log(data.name, '----added now -- ---new');
        $scope.check_distance(data, newState);
      }
      if (data.total_no == 0) {
        var pos = $scope.check_existence(data);
        $scope.vehicals.splice(pos, 1);
      }
    } else if (same_data == -1 && $scope.selected_planet[newState].vehical.length == 1) {
      // console.log('old data is there', $scope.selected_planet[newState].vehical[0].name);
      var temp = $scope.selected_planet[newState].vehical[0];
      console.log(temp);
      // if (data.total_no != 0) {
      $scope.check_distance(data, newState);
      var dec = $scope.check_existence(data);
      // $scope.vehicals[dec].total_no -=1;
      // console.log('----decreased the total number count by 1 in vehicals array');
      // console.log($scope.selected_planet[newState].vehical);
      var is_existing = $scope.check_existence(temp);
      console.log(is_existing);
      $scope.selected_planet[newState].vehical[0] = data;
      if (is_existing != -1) {
        $scope.vehicals[is_existing].total_no += 1;
      } else if (is_existing == -1) {
        temp.total_no = 1;
        $scope.vehicals.push(temp)
      }
      // }
      if (data.total_no == 0) {
        console.log('----pushed back to vehicals arry');
        var pos = $scope.check_existence(data);
        $scope.vehicals.splice(pos, 1);
      }
    }
  }

  $scope.check_distance = function(veh, idx) {
    // console.log("came to check distance of ", veh.name, 'in planet', idx);
    if (veh.max_distance >= $scope.selected_planet[idx].distance) {
      $scope.selected_planet[idx].vehical = [veh];
      return veh.total_no -= 1
    }
    // else {
    //   console.log('cannot got to this planet with this shit');
    // }
  }

  $scope.undo_vehical = function(vInfo, idx) {
    $scope.selected_planet[idx].vehical.splice(0, 1);
    var isthere = $scope.check_existence(vInfo)
    if (isthere == -1) {
      vInfo.total_no += 1;
      $scope.vehicals.push(vInfo);
    } else if (isthere != -1) {
      vInfo.total_no += 1;
    }
  }


$scope.calc_time = function(distance,speed) {
  console.log(distance,'----',speed);
  //time = distance/speed
  $scope.time = distance/speed;
  console.log($scope.time);
}
});


app.controller("result.controller", function($scope, $http, $rootScope) {
  $scope.final_selection = $scope.selected_planets;
  $http({
    method: 'POST',
    url: 'https://findfalcone.herokuapp.com/token',
    headers: {
      'Accept': 'application/json'
    }
  }).then(function successCallback(response) {
    $scope.token = response.data.token;
  }, function errorCallback(response) {
    document.write('<h1 style="text-align:center">Something was not Found Error:404!!</h1>');
  });

});
