/* global flightList */
flightList.directive("loginPanel", [function(){

	return {
		scope: {
			"onAuth" : "="
		},
		controller: function($scope, $element, $attrs, $transclude) {

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
