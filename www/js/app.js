angular.module('underscore', [])
    .factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });


angular.module('your_app_name', [
    'ionic',
    'your_app_name.directives',
    'your_app_name.controllers'
])


.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})



.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
    $stateProvider

        .state('home', {
            url: "/home",
            templateUrl: "views/home.html",
            controller: 'HomeCtrl'
        })
        .state('ai', {
            url: "/ai",
            templateUrl: "views/ai.html",
            controller: 'AICtrl'
        })

    ;
    $sceDelegateProvider.resourceUrlWhitelist(['.*']);

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/ai');
})

;