'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('AuthCtrl', ['$scope', '$http', '$window', '$location', '$cookieStore', function($scope, $http, $window, $location, $cookieStore) {
    $scope.user = { username:null, password:null };
          
    $scope.authenticate = function() {
      console.log('username:', $scope.user.username);  
      $http
          .post('/grails-todo/api/login', $scope.user)
          .success(function (data, status, headers, config) {
            $cookieStore.put('auth', data.token);
            $cookieStore.put('username', data.username);
            $location.path('/tasks');
          })
          .error(function (data, status, headers, config) {
            // Erase the token if the user fails to log in
            $cookieStore.remove('auth');

            // Handle login errors here
            $scope.errorMessage = 'Error: Invalid user or password';
          });
    };
    
    $scope.getUsername = function() {
        return $cookieStore.get('username');
    };
    
    $scope.isAuthenticated = function() {
        var username = $scope.getUsername();
        return username != undefined;
    };
    
    $scope.logout = function() {
            console.log('logOut called');
 
            $http.post('api/logout').
                success(function() {
                    console.log('logout success');
                    $cookieStore.remove('auth');
                    $cookieStore.remove('username');
                    $location.path("/")
                }).
                error(function(data) {
                    console.log('logout error: ' + data);
                });
    };
  }])
  .controller('TaskCtrl', ['$scope', 'Task', function($scope, Task) {
    $scope.tasks = null;
    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.refresh = function() {
        $scope.tasks = Task.get({offset: $scope.currentPage * $scope.pageSize, limit: $scope.pageSize,
            sort: $scope.sortingOrder, order: $scope.reverse ? 'desc' : 'asc'});
//        $scope.$apply();
    };
    
        // change sorting order
    $scope.sort_by = function(newSortingOrder) {
        if ($scope.sortingOrder === newSortingOrder) {
            $scope.reverse = !$scope.reverse;
        }

        $scope.sortingOrder = newSortingOrder;

        // icon setup
        $('th i').each(function(){
            // icon reset
            $(this).removeClass().addClass('glyphicon glyphicon-sort btn-sm');
        });
        if ($scope.reverse) {
            $('th.'+newSortingOrder+' i').removeClass().addClass('glyphicon glyphicon-chevron-up btn-sm');
        } else {
            $('th.'+newSortingOrder+' i').removeClass().addClass('glyphicon glyphicon-chevron-down btn-sm');
        }
        $scope.refresh();
    };
    
    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end / $scope.pageSize; i++) {
            ret.push(i);
        }
        return ret;
    };
    
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.refresh();
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
            $scope.refresh();
        }
    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
        $scope.refresh();
    };    
    
    $scope.openDetails = function(task) {
        $scope.task = angular.copy(task || {});
        $scope.task.completed = $scope.task.status === 'COMPLETED';
        $('#taskDetailsModal').modal('show');
    };
    
    $scope.save = function () {
        $scope.task.status = $scope.task.completed ? 'COMPLETED' : 'CREATED';        
        Task.save({taskId: $scope.task.id}, $scope.task, function(task) {
            $('#taskDetailsModal').modal('hide');
            $scope.refresh();
        });
    };

    $scope.delete = function (taskId) {
        Task.delete({taskId: taskId}, function(task) {
            $scope.refresh();
        });
    };

    $scope.refresh();
  }]);
