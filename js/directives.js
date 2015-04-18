/* global flightList, config */
flightList.directive("loginPanel", ["$http", function($http){

	return {
		scope: {
			"onAuth" : "="
		},
		controller: function($scope, $element) {
			$scope.user = {
				"email" : "",
				"password" : ""
			};

			function login() {
				window.localStorage.setItem("flightlist:session", "1");
				$element.addClass("off");

				// Call authentication method
				if($scope.onAuth && $scope.onAuth.call) {
					$scope.onAuth();
				}
			}

			// Check if user is already logged in
			var status = window.localStorage.getItem("flightlist:session");
			if(status == "1") {
				login();
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
				$http[config().api.method](config().api.login, $scope.user)
					.success(function(data) {
						if(!data || !data.success) {
							$scope.error = "Invalid login credentials provided";
						}
						else {
							login();
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
		restrict: "E",
		// template: '',
		templateUrl: "templates/login.html",
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {

		}
	};
}]);
