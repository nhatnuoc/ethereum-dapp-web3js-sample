angular.module("app.ui.service", [])
    .factory('httpServiceCommon', ['$http', function ($http) {
        var baseUrl = 'http://localhost:8080';
        var userDataInlocal = localStorage.getItem('userData');
        var Jwt;
        if (userDataInlocal != null && userDataInlocal != '' && userDataInlocal != 'null' && userDataInlocal != 'undefined') {
            Jwt = JSON.parse(userDataInlocal).access_token;
        }

        return {
            loginHttp: function (data, success, error) {
                $http({
                    url: baseUrl + '/api/auth/login',
                    method: 'POST',
                    data: data
                }).then(function (response) {
                    success(response.data);
                }, function (error) {
                    error(error.data);
                });
            },
            registerHttp: function (data, success, error) {
                $http({
                    url: baseUrl + '/api/auth/register',
                    method: 'POST',
                    data: data
                }).then(function (response) {
                    success(response.data);
                }, function (errorResponse) {
                    error(errorResponse.data);
                });
            },
            addNewTimeline: function (data, success, error) {
                $http({
                    url: baseUrl + '/api/timeline/create',
                    method: 'POST',
                    headers: {
                        'Authorization': 'JWT ' + Jwt
                    },
                    data: data
                }).then(function (response) {
                    success(response.data);
                }, function (errorResponse) {
                    error(errorResponse.data);
                });
            },
            getTimeline: function (data, success, error) {
                if(!Jwt )
                {
                    userDataInlocal = localStorage.getItem('userData');
                    Jwt = JSON.parse(userDataInlocal).access_token;
                }
                $http({
                    url: baseUrl + '/api/timeline/list',
                    method: 'GET',
                    cache : false,
                    headers: {
                        'Authorization': 'JWT ' + Jwt
                    }
                }).then(function (response) {
                    success(response.data);
                }, function (errorResponse) {
                    error(errorResponse.data);
                });
            },
            upLoadFile: function (data, success, error) {
                $http({
                    url: baseUrl + '/api/media/upload',
                    method: 'POST',
                    headers: {
                        'Authorization': 'JWT ' + Jwt,
                        'Content-Type': undefined
                    },
                    data: data
                }).then(function (response) {
                    success(response.data);
                }, function (errorResponse) {
                    error(errorResponse.data);
                });
            },
            getListAccessKey : function(data,success,error)
            {
                $http({
                    url: baseUrl + '/api/assetsKey/list',
                    method: 'GET',
                    headers: {
                        'Authorization': 'JWT ' + Jwt,
                    }
                }).then(function (response) {
                    success(response.data);
                }, function (errorResponse) {
                    error(errorResponse.data);
                });
                
            },
            addAccessKey : function(data,success,error)
            {
                $http({
                    url: baseUrl + '/api/assetsKey/generate',
                    method: 'GET',
                    headers: {
                        'Authorization': 'JWT ' + Jwt,
                    }
                }).then(function (response) {
                    success(response.data);
                }, function (errorResponse) {
                    error(errorResponse.data);
                });
                
            },
            deleteAccessKey : function(data,success,error)
            {
                $http({
                    url: baseUrl + '/api/assetsKey/delete/'+data.id,
                    method: 'POST',
                    headers: {
                        'Authorization': 'JWT ' + Jwt,
                    }
                }).then(function (response) {
                    success(response.data);
                }, function (errorResponse) {
                    error(errorResponse.data);
                });
                
            },
            triggerAccessKey : function(data,success,error)
            {
                $http({
                    url: baseUrl + '/api/assetsKey/submit',
                    method: 'POST',
                    data : data
                }).then(function (response) {
                    success(response.data);
                }, function (errorResponse) {
                    error(errorResponse.data);
                });
                
            },
            addConfirmKey : function(data,success,error)
            {
                $http({
                    url: baseUrl + '/api/confirmKey/generate',
                    method: 'GET',
                    headers: {
                        'Authorization': 'JWT ' + Jwt,
                    }
                }).then(function (response) {
                    success(response.data);
                }, function (errorResponse) {
                    error(errorResponse.data);
                });
                
            },
            getConfirmKey : function(data,success,error)
            {
                $http({
                    url: baseUrl + '/api/confirmKey/get',
                    method: 'GET',
                    headers: {
                        'Authorization': 'JWT ' + Jwt,
                    }
                }).then(function (response) {
                    success(response.data);
                }, function (errorResponse) {
                    error(errorResponse.data);
                });
                
            },
            triggerConfirmKey : function(data,success,error)
            {
                $http({
                    url: baseUrl + '/api/confirmKey/submit',
                    method: 'POST',
                    headers: {
                        'Authorization': 'JWT ' + Jwt
                    },
                    data : data
                }).then(function (response) {
                    success(response.data);
                }, function (errorResponse) {
                    error(errorResponse.data);
                });
                
            },
            test: function () {
                console.log('hello');
            }
        }
    }]);