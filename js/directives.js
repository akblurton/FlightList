/* global flightList, config */
flightList.directive("loginPanel", ["$http", function($http){
	var CONFIG = config();

	return {
		"scope": {
			"onAuth" : "=",
			"session" : "="
		},
		"controller": function($scope, $element) {
			$scope.user = {
				"email" : "",
				"password" : ""
			};

			function auth() {
				// Call authentication method
				if($scope.onAuth && $scope.onAuth.call) {
					$scope.onAuth();
				}
			}

			// Check if user is already logged in
			if($scope.session) {
				auth();
			}

			$scope.attempt = function() {
				// Wait until user completes form
				if(!$scope.user.email || !$scope.user.password) {
					return false;
				}

				$scope.error = null;

				// Animate submit button
				$element.addClass("working");
				// Disable form
				$element.find("input, button").attr("disabled", "disabled");

				// Send login data to API
				$http[CONFIG.api.login.method](CONFIG.api.login.url, $scope.user)
					.success(function(data) {
						if(!data || !data.success) {
							$scope.error = "Invalid login credentials provided";
						}
						else {
							auth();
						}
					})
					.error(function() {
						$scope.error = "Could not connect to login server";
					})
					.finally(function() {
						// Reset form after every API call
						$scope.user.password = "";
						$element.removeClass("working");
						$element.find("input, button").removeAttr("disabled").eq(1).focus();
					});
			};
		},
		"restrict": "E",
		"templateUrl": "templates/login.html",
	};
}]);

// flight list renderer
flightList.directive("searchResults", [function(){
	return {
		"scope" : {
			"list" : "=flights"
		},
		"restrict" : "E",
		"templateUrl" : "templates/results.html",
	};
}]);