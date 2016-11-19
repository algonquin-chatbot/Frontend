angular.module('your_app_name.controllers', [])


.controller('HomeCtrl', function($scope, $timeout, $ionicScrollDelegate) {

})




.controller('AICtrl', function($scope, $timeout, $ionicScrollDelegate, $http, $ionicModal) {

    $scope.hideTime = true;

    var alternate,
        isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {
        alternate = !alternate;

        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
        //You always need to replace spaces with %20 since REST calls cannot have spaces
        var query = $scope.data.message.split(' ').join('%20');
        //query is where the user text enters the REST call
        $http.get("https://api.api.ai/api/query?v=20150910&query=" + query + "&lang=en&sessionId=2e5f4610-25b7-4df6-a32f-8a7d2c448bee&timezone=America/New_York", {
                headers: {
                    //This is the id from api.ai
                    'Authorization': 'Bearer 1036b0e546f84294b4a41a46a6b86074'
                }
            })
            .success(function(data) {
                console.log(data.result.fulfillment.speech);
                var i = 0;
                console.log("https://api.api.ai/api/query?v=20150910&query=%20" + query + "&lang=en&sessionId=2e5f4610-25b7-4df6-a32f-8a7d2c448bee&timezone=America/New_York");
                if (data.result.fulfillment.speech != "") {
                    $scope.rep = data.result.fulfillment.speech;
                } else {
                    $scope.rep = "I do not know the answer to your question";
                }

                // $scope.mess.push({id: 1, reply: data.result.fulfillment.speech});
                // console.log($scope.mess[i].reply);
                if (data.result.action == "ebayShopping") {
                    $scope.messages.push({
                        userId: '12345',
                        text: $scope.rep,
                        action: data.result.action,
                        image: data.result.fulfillment.data.SearchResult[0].ItemArray.Item[0].GalleryURL,
                        title: data.result.fulfillment.data.SearchResult[0].ItemArray.Item[0].Title,
                        value: data.result.fulfillment.data.SearchResult[0].ItemArray.Item[0].ConvertedCurrentPrice.Value,
                        buyLink: data.result.fulfillment.data.SearchResult[0].ItemArray.Item[0].ViewItemURLForNaturalSearch,
                        data: data.result.fulfillment.data.SearchResult[0].ItemArray,
                        time: d
                    });
                    console.log(data.result.fulfillment.data.SearchResult[0].ItemArray);
                } else {
                    $scope.messages.push({
                        userId: '12345',
                        text: $scope.rep,
                        data: "",
                        time: d
                    });
                }

            })
            .error(function(data) {
                console.log("ERROR: " + data);
            });

        $scope.messages.push({
            userId: '54321',
            text: $scope.data.message,
            time: d
        });

        delete $scope.data.message;
        $ionicScrollDelegate.scrollBottom(true);

    };


    $scope.inputUp = function() {
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true);
        }, 300);

    };

    $scope.inputDown = function() {
        if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function() {
        // cordova.plugins.Keyboard.close();
    };


    $scope.data = {};
    $scope.myId = '12345';
    $scope.messages = [];
    $scope.modalMessages = [];

    $scope.showModal = function(dataModal) {
        $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope,
            animation: 'slideInLeft'
        }).then(function(modal) {
            $scope.selectedData = dataModal;
            console.log($scope.selectedData);
            $scope.ebayShopping = function() {
                if ($scope.selectedData != "") {
                    var length = $scope.selectedData.Item.length;
                    for (var x = 0; x < length; x++) {
                        $scope.modalMessages.push({
                            userId: '12345',
                            image: $scope.selectedData.Item[x].GalleryURL,
                            title: $scope.selectedData.Item[x].Title,
                            value: $scope.selectedData.Item[x].ConvertedCurrentPrice.Value,
                            buyLink: $scope.selectedData.Item[x].ViewItemURLForNaturalSearch
                        });
                    }
                }
            }
            $scope.ebayShopping();
            $scope.modal = modal;
            $scope.modal.show();
            $scope.hideModal = function() {
                $scope.modal.hide();
                // Note that $scope.$on('destroy') isn't called in new ionic builds where cache is used
                // It is important to remove the modal to avoid memory leaks
                $scope.modal.remove();
                $scope.modalMessages = []
            }

        });
    }
    
})

;