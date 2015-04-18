/* global angular */
/* exported config */

// Config object, use $.extend to prevent modification
function config() {
	return $.extend({}, {
		"api" : {
			"login" : "api/login.json",
			"method" : "get"
		}
	});
}


var flightList = angular.module("FlightList", []);

// Login Controller
flightList.controller("LoginCtrl", ["$scope", function($scope) {
    $scope.showList = function() {
        
    };
}]);
