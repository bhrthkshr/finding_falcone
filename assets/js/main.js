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
    .when("/vehicles", {
      templateUrl: "templates/vehicles.html",
      controller: "vehicle.controller",
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

app.controller("vehicle.controller", function($scope, $http) {
  $scope.selected_planet = $scope.selected_planets;
  if ($scope.selected_planet) {
    for (var i = 0; i < $scope.selected_planet.length; i++) {
      $scope.selected_planet[i].vehicle = [];
      $scope.selected_planet[i].req_time = 0;
    }
    $scope.vehicles = [];
    $http({
      method: 'GET',
      url: 'https://findfalcone.herokuapp.com/vehicles'
    }).then(function successCallback(response) {
      $scope.data = response.data;
      $scope.loaded = true;
      for (var i = 0; i < $scope.data.length; i++) {
        $scope.vehicles.push($scope.data[i]);
      }
    }, function errorCallback(response) {
      document.write('<h1 style="text-align:center">Something was not Found Error:404!!</h1>');
    });
  } else {
    $scope.loaded = true;
    console.log('planets got cleared or was not loaded');
  }
  $scope.check_existence = function(value) {
    //to check if number of vehicle is 0 or 1
    //to deal with vehicles more than 1
    var pos = $scope.vehicles.map(function(e) {
      return e.name;
    }).indexOf(value.name);
    console.log(pos, '----is the index value of vehicle');
    return pos;
  }
  $scope.check_for_same_vehicle = function(i, value) {
    //this checks for a vehicle is already added to a planet
    console.log($scope.selected_planet[i].vehicle, '------checking vehiii');
    var pos = $scope.selected_planet[i].vehicle.map(function(e) {
      return e.name;
    }).indexOf(value.name);
    return pos;
  }

  $scope.onDropComplete = function(data, evt, newState) {
    console.log("drop complete");
    var same_data = $scope.check_for_same_vehicle(newState, data);
    if (same_data != -1) {
      console.log('sameeeeeeeeeeeee', data.name, "----", same_data);
    } else if (same_data == -1 && $scope.selected_planet[newState].vehicle.length == 0) {
      console.log('issss diffreent');
      // console.log($scope.selected_planet[newState].vehicle[0].name == 'undefined', '----in the planet ---old');
      if (data.total_no != 0) {
        console.log(data.name, '----added now -- ---new');
        $scope.check_distance(data, newState);
      }
      if (data.total_no == 0) {
        var pos = $scope.check_existence(data);
        $scope.vehicles.splice(pos, 1);
      }
    } else if (same_data == -1 && $scope.selected_planet[newState].vehicle.length == 1) {
      // console.log('old data is there', $scope.selected_planet[newState].vehicle[0].name);
      var temp = $scope.selected_planet[newState].vehicle[0];
      console.log(temp);
      // if (data.total_no != 0) {
      $scope.check_distance(data, newState);
      var dec = $scope.check_existence(data);
      // $scope.vehicles[dec].total_no -=1;
      // console.log('----decreased the total number count by 1 in vehicles array');
      // console.log($scope.selected_planet[newState].vehicle);
      var is_existing = $scope.check_existence(temp);
      console.log(is_existing);
      $scope.selected_planet[newState].vehicle[0] = data;
      if (is_existing != -1) {
        $scope.vehicles[is_existing].total_no += 1;
      } else if (is_existing == -1) {
        temp.total_no = 1;
        $scope.vehicles.push(temp)
      }
      // }
      if (data.total_no == 0) {
        console.log('----pushed back to vehicles arry');
        var pos = $scope.check_existence(data);
        $scope.vehicles.splice(pos, 1);
      }
    }
  }

  $scope.alloted = false;
  $scope.check_allotment = function() {
    var val = 0;
    for (var i = 0; i < $scope.selected_planet.length; i++) {
      if ($scope.selected_planet[i].vehicle.length == 1) {
        val += 1
        if (val == 4) {
          $scope.alloted = true;
        } else {
          $scope.alloted = false;
        }
      }
    }
  }

  $scope.check_distance = function(veh, idx) {
    // console.log("came to check distance of ", veh.name, 'in planet', idx);
    if (veh.max_distance >= $scope.selected_planet[idx].distance) {
      $scope.selected_planet[idx].vehicle = [veh];
      $scope.calc_time($scope.selected_planet[idx].distance, veh.speed, idx)
      $scope.check_allotment();
      return veh.total_no -= 1
    }
    // else {
    //   console.log('cannot got to this planet with this shit');
    // }
  }

  $scope.undo_vehicle = function(vInfo, idx) {
    $scope.selected_planet[idx].vehicle.splice(0, 1);
    $scope.check_allotment();
    var isthere = $scope.check_existence(vInfo)
    if (isthere == -1) {
      vInfo.total_no += 1;
      $scope.vehicles.push(vInfo);
    } else if (isthere != -1) {
      vInfo.total_no += 1;
    }
  }

  $scope.calc_time = function(distance, speed, idx) {
    console.log(distance, '----', speed);
    //time = distance/speed
    $scope.time = distance / speed;
    console.log($scope.time);
    $scope.selected_planet[idx].req_time = $scope.time;
  }


});


app.controller("result.controller", function($scope, $http, $rootScope) {
  $scope.final_selection = $scope.selected_planets;
  $scope.loaded = false;
  $scope.failed =false;
  $scope.planet_names = [];
  $scope.vehicle_names = [];
  if ($scope.final_selection) {
    for (var i = 0; i < $scope.final_selection.length; i++) {
      $scope.planet_names.push($scope.final_selection[i].name);
      $scope.vehicle_names.push($scope.final_selection[i].vehicle[0].name);
    }
  }

  $scope.begin_finding = function(token_value) {
    console.log('cameeeeeee', token_value);
    var datatosend = {
      "token": token_value,
      "planet_names": $scope.planet_names,
      "vehicle_names": $scope.vehicle_names,
    }
    console.log(datatosend);
    $http({
      method: 'POST',
      url: 'https://findfalcone.herokuapp.com/find',
      data: datatosend,
      headers: {
        'Accept': 'application/json'
        // 'content-type': 'application/json'
      },
    }).then(function successCallback(response) {
      $scope.results = response.data;
      $scope.loaded = true;
      $scope.find_time($scope.results.planet_name);
    }, function errorCallback(response) {
      $scope.failed =true;
      $scope.loaded = true;

      // document.write('<h1 style="text-align:center">Something went wrong Error:404!!</h1>');
    });
  }

  $http({
    method: 'POST',
    url: 'https://findfalcone.herokuapp.com/token',
    headers: {
      'Accept': 'application/json'
    }
  }).then(function successCallback(response) {
    $scope.token = response.data.token;
    $scope.begin_finding($scope.token)
  }, function errorCallback(response) {
    $scope.failed =true;
    // document.write('<h1 style="text-align:center">Something went wrong Error:404!!</h1>');
  });


  $scope.find_time = function(planet) {
    console.log(planet);
    if (planet) {
      pos = $scope.final_selection.map(function(e) {
        return e.name;
      }).indexOf(planet);
      $scope.time_taken = $scope.final_selection[pos].req_time;
      $scope.veh_name= $scope.final_selection[pos].vehicle[0].name;
      console.log(veh_name);
    }
  }
});
