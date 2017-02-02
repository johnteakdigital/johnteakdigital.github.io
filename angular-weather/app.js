//Example API Call for 5-Day 3-Hour http://api.openweathermap.org/data/2.5/forecast?q=London,us&appid=2a194e1e46c9509c013da051e3d692e6

// API Key
var apiKey = '2a194e1e46c9509c013da051e3d692e6',
		apiUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily';

//CREATE THE MODULE FOR THE APP
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);


//CONFIGURE ROUTES
weatherApp.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'pages/home.html',
		controller: 'mainController'
	})
	.when('/forecast', {
		templateUrl: 'pages/forecast.html',
		controller: 'forecastController'
	})
	.when('/forecast/:days', {
		templateUrl: 'pages/forecast.html',
		controller: 'forecastController'
	})

});

//CUSTOM SERVICES
weatherApp.service('getForecast', function(){
	var self = this;
	this.city = "New York, NY";
	
});

weatherApp.service('apiService', ['$resource', function($resource) {
	
	var self = this;
	
	this.getWeather = function(city, count, url, key) {	
		
		var weatherAPI = $resource(url, { callback: 'JSON_CALLBACK' }, { get: { method: "JSONP" }});

		//Succesfull resource pull use .get to get data from the JSON
		return weatherAPI.get({ q: city, cnt: count, appid: key });
	}

}]);

//CONFIGURE CONTROLLERS
weatherApp.controller('mainController', ['$scope', '$location', 'getForecast', function($scope, $location, getForecast) {
	
	//Set the city in $scope to match the getForecast service
	$scope.city = getForecast.city;
	//Make sure to reflect that on the service when the $scope.city updates
	$scope.$watch('city', function() {
		getForecast.city = $scope.city;
	});
	
	//submit form function
	$scope.submit = function() {
		//uses the $location service
		$location.path('/forecast');
	}
	
}]);

weatherApp.controller('forecastController', ['$scope', '$routeParams', 'getForecast', 'apiService', function($scope,  $routeParams, getForecast, apiService) {
	
	$scope.city = getForecast.city;
	
	//Use route params to get parameters from the route url
	$scope.count = parseInt($routeParams.days) || 2;
	
	//Use the custom service to pull weather data dynamically using a service and method 	
	$scope.weatherResult = apiService.getWeather($scope.city, $scope.count, apiUrl, apiKey);
	
	
	$scope.convertToF = function(degK) {
		return Math.round((1.8 * (degK - 273)) + 32)
	}
	
	
	// https://docs.angularjs.org/api/ng/filter/
	$scope.convertDate = function(d) {
		//provided in milliseconds
		return new Date(d * 1000);
	}

}]);

//CUSTOM DIRECTIVE
weatherApp.directive('weatherResult', function(){
	return {
		templateUrl: 'dirs/weather-result.html',
		replace: true,
		scope: {
			weatherObj: '=',
			tempFunction: '&',
			dateFunction: '&',
			dateFormat: '@'
		}
	}
});
