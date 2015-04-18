/* global angular */
/* exported config */

// Config object, use $.extend to prevent modification
function config() {
	return $.extend({}, {
		"api" : {
			"login" : {
				"url" : "api/login.json",
				"method" : "get"
			}
		}
	});
}

// Global App Module
var flightList = angular.module("FlightList", []);


// User Session global service
flightList.factory("UserSession", ["$rootScope", function($rootScope){
	var userSession = {};

	userSession.create = function() {
		window.localStorage.setItem("flightlist:session", "1");
		$rootScope.$broadcast("user:login");
		return true;
	};

	userSession.destroy = function() {
		window.localStorage.removeItem("flightlist:session");
		$rootScope.$broadcast("user:logout");
	};

	userSession.exists = function() {
		return window.localStorage.getItem("flightlist:session") == "1";
	};

	return userSession;
}]);

// Navbar event controller
flightList.controller("NavCtrl", ["$scope", "UserSession", function($scope, UserSession) {
	$scope.session = false;
	$scope.logout = function() {
		UserSession.destroy();
	};
	$scope.$on("user:login", function() {
		$scope.session = true;
	});
}]);

// Login Controller
flightList.controller("LoginCtrl", ["$scope", "UserSession", function($scope, UserSession) {
	$scope.session = UserSession.exists();

	// When login module authenticates, setup session (using local storage for now)
    $scope.setSession = function() {
    	$scope.session = UserSession.create();
    };

    $scope.$on("user:logout", function() {
		$scope.session = UserSession.exists();
	});
}]);
}]);
