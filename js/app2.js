(function (angular) {
	'use strict';

	// Your starting point. Enjoy the ride!
	/**
	* 主module
	*
	* description
	*/
	//为应用程序创建一个模块，用来管理界面的结构
	var myApp = angular.module('mytodoMVC',['ngRoute']);
	//路由配置
	myApp.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		$locationProvider.hashPrefix('');
		$routeProvider
		.when('/:status?',{
			controller:'mainController',
			templateUrl:"main_template"
		})
		// .otherwise({
		// 	redirectTo:'/'
		// })
	}])

	myApp.controller('mainController',['$scope','$routeParams','$route',
		function($scope,$routeParams,$route){
		//文本框需要一个模型
		$scope.text = '';

		//任务列表也需要一个模型
		//每一个任务的结构{ id:1, text: '学习', completed: true }
		$scope.todos = [
		{ id : 0.01, text : '学习', completed : false},
		{ id : 0.02, text : '睡觉', completed : false},
		{ id : 0.03, text : '打豆豆', completed : true}
		];

		//添加todo
		$scope.add = function() {
			$scope.todos.push({
				//自动增长
				id : getId(),
				// 由于$scope默认是双向绑定的，add的同时肯定可以拿到界面上
				// 的输入值
				text : $scope.text,
				completed : false
			});
			//清除模型数据--->清除文本框
			$scope.text = '';
		};

		//删除
		$scope.remove = function(id) {
			//删除谁
			for (var i = 0,len = $scope.todos.length; i < len; i++) {
				if($scope.todos[i].id === id) {
					$scope.todos.splice(i,1);
					break;
				}
			}
		};

		// 清空
		$scope.clear = function() {
			var result = [];
			for (var i = 0; i < $scope.todos.length; i++) {
				if(!$scope.todos[i].completed) {
					result.push($scope.todos[i]);
				}
			}
			$scope.todos = result
		};

		//是否已经有完成的
		//若ng-show绑定函数，该函数必须返回布尔值
		$scope.existCompleted = function() {
			for (var i = 0, len = $scope.todos.length; i < len; i++) {
				if($scope.todos[i].completed){
					return true;
				}
			}
			return false;
		};

		//当前编辑元素
		$scope.currentEditingId = -1;
		$scope.editing = function(id) {
			$scope.currentEditingId = id;
		}
		$scope.save = function(id) {
			$scope.currentEditingId = -1;
		};

		
		var now = true;
		$scope.toggleAll = function(){
			for (var i = 0; i < $scope.todos.length; i++) {
				$scope.todos[i].completed = now;
			}
			now = !now;
		};
		
		//完美处理id，但效率低
		function getId(){
			var id = Math.random();
			for (var i = 0, len = $scope.todos.length; i < len; i++) {
				if($scope.todos[i].id === id){
					id = getId();
					break;
				}
			}
			return id;
		}

		//watch只能监视属于$scope的成员
		//让$scope也有一个$location成员
		$scope.selector = {};  // {} {completed:true} {completed:false}
		console.log($routeParams);
		var status = $routeParams.status;
		switch(status) {
			case 'active':
				$scope.selector = {completed:false};
				break;
			case 'completed':
				$scope.selector = {completed:true};
				break;
			default:
				$scope.selector = {};
				break;
		}
	
		//自定义比较函数
		//source:过滤器前的属性值，target:过滤器后的属性值
		$scope.equalCompare = function(source,target) {
			// console.log(source,target);
			return source == target;
		}
	}]);
})(angular);

