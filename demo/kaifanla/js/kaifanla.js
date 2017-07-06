/**
 * Created by bjwsl-001 on 2016/11/5.
 */

var app = angular.module('kaifanla',['ng','ngRoute']);

//声明一个控制器 parentCtrl
app.controller('parentCtrl',
  ['$scope','$location',
    function ($scope,$location) {
      $scope.jump = function (arg) {
        $location.path(arg);
      }
    }]);

app.controller('mainCtrl',
  ['$scope','$http',
    function ($scope,$http) {

      $scope.hasMore = true;

      $http.get('data/dish_getbypage.php?start=0')
        .success(function (data) {
          console.log(data);
          $scope.dishList = data;
        });
      
      $scope.loadMore = function () {
        $http.get('data/dish_getbypage.php?start='+$scope.dishList.length)
          .success(function (data) {
            console.log(data);
            if(data.length < 5)
            {
              $scope.hasMore = false;
            }
            $scope.dishList = $scope.dishList.concat(data);
          });
      }

      $scope.$watch('kw', function () {
        console.log($scope.kw);
        if($scope.kw)
        {
          $http.get('data/dish_getbykw.php?kw='+$scope.kw)
            .success(function (data) {
              $scope.dishList = data;
            })
        }
      });
}]);

app.controller('detailCtrl',
  ['$scope','$routeParams','$http',
    function ($scope,$routeParams,$http) {

      console.log($routeParams.did);

      $http.get('data/dish_getbyid.php?id='+$routeParams.did)
        .success(function (data) {
          console.log(data);
          $scope.dish = data[0];
        });

  }]);

app.controller('orderCtrl',[
  '$scope','$routeParams','$http','$rootScope',
  function ($scope,$routeParams,$http,$rootScope) {
    console.log($routeParams.did);

    $scope.order={'did':$routeParams.did};

    $scope.submitOrder = function () {
      //console.log($scope.order);
      var str = jQuery.param($scope.order);
      //console.log(str);
      $http.get('data/order_add.php?'+str)
        .success(function (data) {
          console.log(data);
          if(data[0].msg == 'succ')
          {
            $rootScope.phone = $scope.order.phone;
            $scope.succMsg = "订餐成功！您的订单编号为："+data[0].oid+"您可以在用户中心查看订单状态";
          }
          else
          {
            $scope.errMsg = '订餐失败！';
          }
        })
    }
    
  }
]);

app.controller('myOrderCtrl',
  ['$scope','$rootScope','$http',
    function ($scope,$rootScope,$http) {

      $http.get('data/order_getbyphone.php?phone='
        +$rootScope.phone).success(function (data) {
        $scope.dishList = data;
      });

  }]);

app.config(function ($routeProvider) {

  $routeProvider
    .when('/start',{
      templateUrl:'tpl/start.html'
    })
    .when('/main',{
      templateUrl:'tpl/main.html',
      controller:'mainCtrl'
    })
    .when('/detail',{
      templateUrl:'tpl/detail.html',
      controller:'detailCtrl'
    })
    .when('/detail/:did',{
      templateUrl:'tpl/detail.html',
      controller:"detailCtrl"
    })
    .when('/order',{
      templateUrl:'tpl/order.html'
    })
    .when('/order/:did',{
      templateUrl:'tpl/order.html',
      controller:'orderCtrl'
    })
    .when('/myOrder',{
      templateUrl:'tpl/myOrder.html',
      controller:'myOrderCtrl'
    })
    .otherwise({redirectTo:'/start'});

});