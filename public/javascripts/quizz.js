var app = angular.module('app', ['ngResource','ngSockets','ngAria','ngMaterial']);

app.config(['$socketProvider', '$locationProvider', '$logProvider', function ($socketProvider, $locationProvider, $logProvider) {
    //$socketProvider.setConnectionUrl('http://localhost:3000');
    //$locationProvider.html5Mode(true);
    $logProvider.debugEnabled(false);
}]);

// guaranteed to run prior to the rest of the app.
app.run(function($rootScope) {
  $rootScope.appName = "Quizz";
  $rootScope.appVersion = "1.0.0";    
});

app.controller('QuizzController', ['$scope', '$log', '$http', '$window', '$interval', '$socket', function($scope, $log, $http, $window, $interval, $socket) {
  
  $scope.question = -1;
  $scope.isSubmitted = false;
  $scope.started = false;
  $scope.ended = false;
  $scope.determinateValue = 0; 
  var timer;
    
  $scope.messages = ['Your name is required.'];
    
  $scope.register = function() {   
      $log.debug('submit register');
      $scope.message = "";  // clear previous error message.
      $http.post('/register', { name: $scope.name })
        .success(function(data) {
            $window.location.href = '/quizz';
        })
        .error(function(data) {
            $scope.message = data; // show error message.
        });      
  }
    
  $http.get('questions/questions').success(function(data) {
      console.log('Questions retrieved.');
      $scope.questions = data.questions;
  }); 

  $http.get('questions/instructions').success(function(data) {
      console.log('Instructions retrieved.');
      $scope.instructions = data.text;
  }); 
    
  $socket.on('start', function(data) {
      console.log('Start event received from server by client.');
      $scope.started = true;
  });
    
  $socket.on('question', function (data) {
      console.log('Question event received from server by client.');
      $scope.question = data;
  });

  $socket.on('end', function() {
      console.log('End event received from server by client.');
      $scope.started = false;
      $scope.ended = true;
  });
  
  var clock = function(){
        $scope.determinateValue += 1;
        if($scope.determinateValue >= 100) {
            $scope.isSubmitted = true; // Disable button;
            //$interval.cancel(timer);
        }
  };
    
  $scope.$watch('question', function(newVal, oldVal) {
    $scope.determinateValue = 0;
    if(newVal >= 0) {  
        timer = $interval(clock,100, 300);  
    }
  });
    
  $scope.submitAnswer = function() {
    $http.post('/questions/answer', { question: $scope.question, answer: $scope.answer })
             .success(function (data) {
                 $scope.message = "Answer submitted";
             });
    $scope.isSubmitted = true; // disable the button
    $interval.cancel(timer);
    console.log('Answer event emitted by client to server.');    
  };    
    
}]);


app.controller('DashboardController', ['$scope', '$http', '$socket', function($scope, $http, $socket) {

    $scope.question = -1;
    $scope.goQuestion = "";
    $scope.started = false;
    $scope.ended = false;
    
    $http.get('questions/questions').success(function(data) {
        $scope.questions = data.questions;
        console.log('Questions retrieved:' + data);
    });
    
    $scope.startQuizz = function() {
        $scope.started = true;
        $socket.emit('start', $scope.question); 
    };
    
    $scope.nextQuestion = function() {
        if($scope.question < $scope.questions.length-1) {
          $scope.question++
          $socket.emit('question', $scope.question);        
        }
    };
    
    $scope.previousQuestion = function() {
        if($scope.question > 0) {
          $scope.question--;
          $socket.emit('question', $scope.question);        
        }        
    };

    $scope.gotoQuestion = function() {
        if($scope.goQuestion > 0 && $scope.goQuestion <= $scope.questions.length) {
            $scope.question = Number($scope.goQuestion)-1;
            $socket.emit('question', $scope.question);        
        }
    };
    
    $scope.endQuizz = function() {
        $socket.emit('end');
        $scope.ended = true;
    };
    
}]);
