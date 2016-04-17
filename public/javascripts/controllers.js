app.controller('MenuCtrl', function($scope, UserService, $location) {
    $scope.service = UserService;
    
    $scope.logout = function() {
        UserService.logout().success(function(data){
            $location.url('/');
        });
    };
    
    UserService.getAuthInfo();
    
});
    
app.controller('EntriesCtrl', function($scope, $resource, postSvc, UserService, $uibModal, $location) {
    $scope.auth = UserService;
    $scope.service = postSvc;
    $scope.query;
    
    $scope.openModal = function(post) {
        return $uibModal.open({
            templateUrl:'./templates/adm_templates/delete_modal.html',
            controller:function($scope, $uibModalInstance, toDelete, postSvc) {
                $scope.post = toDelete;
                $scope.deletePost = function(toDelete) {
                    postSvc.deletePost(toDelete);
                    $uibModalInstance.close('deletePost');
                };
                
                $scope.dismissModal = function() {
                    $uibModalInstance.close('cancel');
                }
            },
            size:'md',
            animation:true,
            resolve:{
                toDelete:function() {
                    return post;
                }
            }
        });
    };
    
    $scope.setActivePost = function(post) {
        postSvc.activePost = post;
        $location.url('/post/' + post._id);
    };
    
    $scope.service.getPosts();
    
});

app.controller('SignupForm', function($scope, $resource, UserService) {
    $scope.user = UserService;
    $scope.userTaken = false;
    
    $scope.saveUser = function() {
        UserService.saveUser({user:$scope.newUser.user, pass:$scope.newUser.pass}).success(function(data) {
            
            UserService.getAuthInfo();
            return;
        }).error(function(data) {
            if (!data) {
                $scope.userTaken = true;
                return;
            }
        });
    };
});

app.controller('loginCtrl', function($scope, UserService, $location) {
    $scope.errorLog = false;
    
    $scope.loginUser = function() {
        $scope.errorLog = false;
        UserService.login({user:$scope.user.user, pass:$scope.user.pass}).success(function(data) {
            UserService.getAuthInfo();
            $location.url('/');
        }).error(function(data) {
            if (!data) {
                $scope.errorLog = true;
            }
        });
    };
});

app.controller('PostCtrl', function($scope, postSvc, $location, UserService, $sanitize) {
    $scope.auth = UserService;
    $scope.service = postSvc;
    
    $scope.setActivePost = function(post) {
        postSvc.activePost = post;
        $location.url('/post/' + post._id);
    };
    
    $scope.newComment = function(post) {
        postSvc.addComment(post);
    };
    
    postSvc.getPosts();
    
    
    postSvc.singlePost.get({id:$location.path().substr(6)}, function(data) {
        postSvc.activePost = data;
    });
    
});