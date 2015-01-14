var app = angular.module('vk-app', ['ngRoute', 'ui.bootstrap']);
app.run(function($rootScope, UTILS, AJAX, $location, $routeParams) {
	VK.init(function() { 
		$location.path("/main");
	}, function() { 
	  
	}, '5.26'); 
});
app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'pages/loading.html',
		controller: controllers.loading
	}).when('/main', {
		templateUrl: 'pages/main.html',
		controller: controllers.main
	}).when('/error', {
		templateUrl: 'pages/error.html',
		controller: controllers.error
	});
});
app.service('UTILS', function ($rootScope) {
	this.get_url_params = function(){
		var query_obj = {};
		var get = location.search;
		if (get) {
			var query_arr = (get.substr(1)).split('&');
			var tmp_val;
			for (var i = 0; i < query_arr.length; i++) {
				tmp_val = query_arr[i].split("=");
				query_obj[tmp_val[0]] = tmp_val[1];
			}
		}
		return query_obj;
	}
});
app.service('HTTP', function ($http) {
    this.data2str = function(d){
		var $str = "";
		angular.forEach(d, function(v, k) {
		    $str += k+"="+v+"&";
		});
		return $str;
	};
    this.post = function(u, d, c, f){
        $http({
  			    url: u,
  			    method: "POST",
  			    data: this.data2str(d),
  				headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                      }
  			}).success(c).error(f ? f : function(d){
        });
    };
    this.get = function (url, js_cb) {
        return $http.jsonp(url+(js_cb ? "&callback=JSON_CALLBACK": ""));
    };
  });
app.service('AJAX', function ($http, $rootScope, UTILS) {
	this.post = function(m, d, c, f){
			var data = UTILS.get_url_params();
			d.method = m;
			d.id = data.viewer_id;
			d.auth_key = data.auth_key;
			$http({
  			    url: 'ajax/call.php',
  			    method: "POST",
  			    data: d
  			}).success(function(d){c(d['response'])});
	}
});