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
			$scope.newuser = {
				"email" : "",
				"password" : "",
				"confirmpassword" : ""
			};
			$scope.registering = false;

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

				$scope.registerSuccess = false;
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


			$scope.register = function() {
				// Wait until user completes form
				if(!$scope.newuser.email || !$scope.newuser.password) {
					return false;
				}
				$scope.regError = false;
				$scope.registerSuccess = false;

				// Validate user profile
				if($scope.newuser.password != $scope.newuser.passwordConfirm) {
					$scope.regError = "Passwords do not match";
				}
				else if($scope.newuser.password.length < 8) {
					$scope.regError = "Password must be at least 8 characters long";
				}

				if($scope.regError) {
					return;
				}

				// Animate submit button
				$element.addClass("working");
				// Disable form
				$element.find("input, button").attr("disabled", "disabled");

				// Send register data to API
				$http[CONFIG.api.register.method](CONFIG.api.register.url, $scope.newuser)
					.success(function(data) {
						if(!data || !data.success) {
							$scope.error = "Could not register right now, please try again later";
						}
						else {
							$scope.isRegistering(false);
							$scope.user.email = $scope.newuser.email;
							$scope.registerSuccess = true;
						}
					})
					.error(function() {
						$scope.regError = "Could not connect to registration server";
					})
					.finally(function() {
						// Reset form after every API call
						$element.removeClass("working");
						$element.find("input, button").removeAttr("disabled").eq(1).focus();
					});

			};

			$scope.isRegistering = function(state) {
				$scope.registering = state;
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
			"flights" : "=",
			"filter" : "="
		},
		"restrict" : "E",
		"templateUrl" : "templates/results.html",
		"link" : function($scope) {
			$scope.focused = $scope.show = false;
			$scope.showMore = function(flight) {
				$scope.focused = flight;
				$scope.show = true;
			};

			$scope.filterChanges = function(value) {
				if($scope.filter.zero && value.changes === 0) {
					return true;
				}
				if($scope.filter.one && value.changes === 1) {
					return true;
				}
				if($scope.filter.two && value.changes >= 2) {
					return true;
				}
				return false;
			};

			$scope.closeMore = function() {
				$scope.show = false;
			};

			$scope.purchase = function() {
				/* global alert */
				alert("Coming soon!");
			};
		}
	};
}]);