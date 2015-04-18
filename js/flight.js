/* global angular */
/* exported config */

// Config object, use $.extend to prevent modification
function config() {
	return $.extend({}, {
		"api" : {
			"login" : {
				"url" : "api/login.json",
				"method" : "get"
			},
			"register" : {
				"url" : "api/register.json",
				"method" : "get"
			},
			"cities": {
				"url" : "api/cities.json",
				"method" : "get"
			},
			"search" : {
				"method" : "get",
				"url" : "api/search/%1/%2.json"
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

// Flight Listing controller
flightList.controller("ListCtrl", ["$scope", "UserSession", "$http", function($scope, UserSession, $http) {
	var CONFIG = config();

	function init() {
		$scope.cities = [];
		$scope.session = false;
		$scope.search = {
			"changes" : {
				"one" : true,
				"two" : true,
				"zero" : true
			}
		};
		$scope.results = {};
		$scope.sort = {
			"field" : "time",
			"dir" : "asc"
		};
	}
	init();

	$scope.sortResults = function() {
		if(!$scope.results || !$scope.results.list) {
			return;
		}

		$scope.results.list.sort(function(a, b) {
			a = a[$scope.sort.field];
			b = b[$scope.sort.field];

			return (a-b)*($scope.sort.dir == "asc" ? 1 : -1);
		});
	};


	// Listen for login/logout event
	$scope.$on("user:login", function() {
		$scope.session = UserSession.exists();
		// Fetch list
		$scope.fetch();
	});

	$scope.$on("user:logout", function() {
		init();
	});

	$scope.exclusiveTo = function(item) {
		return !$scope.search.from || $scope.search.from.id != item.id;
	};

	$scope.exclusiveFrom = function(item) {
		return !$scope.search.to || $scope.search.to.id != item.id;
	};

	$scope.fetch = function() {
		$scope.working = true;
		$scope.error = false;
		$http[CONFIG.api.cities.method](CONFIG.api.cities.url)
			.success(function(data) {
				data.sort(function(a, b) {
					if(a.label < b.label) {
						return -1;
					}
					if(a.label > b.label) {
						return 1;
					}
					return 0;
				});
				$scope.cities = data;
	
			})
			.error(function() {
				$scope.error = true;
			})
			.finally(function() {
				$scope.working = false;
			});
	};

	// Search for available flights
	$scope.searchFlights = function() {
		// At least one of the search fields is empty
		if(!$scope.search.to || !$scope.search.from) {
			$scope.results = {};
			$scope.searching = false;
			return;
		}

		// Begin search
		$scope.searching = true;
		$http[CONFIG.api.search.method](CONFIG.api.search.url.replace("%1", $scope.search.from.id).replace("%2", $scope.search.to.id))
			.success(function(data) {
				$scope.results = {
					"list" : data,
					"from" : $scope.search.from.label,
					"to" : $scope.search.to.label,
				};
				$scope.sortResults();
			})
			.error(function() {

			})
			.finally(function() {
				$scope.searching = false;
			});

	};

	$scope.sortDirection = function(type) {
		$scope.sort.dir = type;
		$scope.sortResults();
	};

}]);
