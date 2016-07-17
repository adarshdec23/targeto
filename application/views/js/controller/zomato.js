myApp.controller('ZomatoController', function($scope, $rootScope, $location, NK_API, $window) {
    $scope.validation = function() {
        var email = $("#email").val();
        var boolR = false;
        if (email == "undefined" || email == undefined ||
            email == null || email == "null" || email == "") {
            sweetAlert("error", "Enter an email", "error");
            $location.path('/zomato');
        } else {
            boolR = true;
        }
        if (boolR) {
            var json = {
                "email": email,                
            };
            order_summary_analysis(JSON.stringify(json));
            weekday_summary_analysis(JSON.stringify(json));
            weekend_summary_analysis(JSON.stringify(json));
        }
    }
    function clearForm() {
        $('.clear').val("");
        $('label').removeClass("active");
        $('i').removeClass("active");
        $('input').removeClass("valid");
    }
    function check(evt) {
      var theEvent = evt || window.event;
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode( key );
      var regex = /[0-10]|\./;
      if( !regex.test(key) ) {
        theEvent.returnValue = false;
        // if(theEvent.preventDefault) 
            theEvent.preventDefault();
      }
    }
    function order_summary_analysis(email) {
        $.ajax({
            type: "POST",
            url: NK_API + "/orderMapping/generalTrend/",
            data: email,
            contentType: "application/json",
            cache: false,
            success: function(data) {
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'order_summary_analysis',
                        type: 'column',
                        margin: 75,
                        options3d: {
                            enabled: true,
                            alpha: 35,
                            beta: 15,
                            depth: 50,
                            viewDistance: 25
                        }
                    },
                    title: {
                        text: data.email
                    },
                    subtitle: {
                        text: 'Cuisines'
                    },
                    plotOptions: {
                        column: {
                            depth: 25
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Orders Count'
                        },
                        allowDecimals: false
                    },
                    xAxis: {
                        categories: data.graphNameList
                    },
                    series: [{
                        name: 'Total Orders',
                        data: data.graphValueList
                    }]
                });
            }
        });
    }
    function weekday_summary_analysis(email) {
        $.ajax({
            type: "POST",
            url: NK_API + "/orderMapping/weekdayTrend/",
            data: email,
            contentType: "application/json",
            cache: false,
            success: function(data) {
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'weekday_summary_analysis',
                        type: 'column',
                        margin: 75,
                        options3d: {
                            enabled: true,
                            alpha: 35,
                            beta: 15,
                            depth: 50,
                            viewDistance: 25
                        }
                    },
                    title: {
                        text: data.email
                    },
                    subtitle: {
                        text: 'Cuisines'
                    },
                    plotOptions: {
                        column: {
                            depth: 25
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Orders Count'
                        },
                        allowDecimals: false
                    },
                    xAxis: {
                        categories: data.graphNameList
                    },
                    series: [{
                        name: 'Total Orders',
                        data: data.graphValueList
                    }]
                });
            }
        });
    }
    function weekend_summary_analysis(email) {
        $.ajax({
            type: "POST",
            url: NK_API + "/orderMapping/weekendTrend/",
            data: email,
            contentType: "application/json",
            cache: false,
            success: function(data) {
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'weekend_summary_analysis',
                        type: 'column',
                        margin: 75,
                        options3d: {
                            enabled: true,
                            alpha: 35,
                            beta: 15,
                            depth: 50,
                            viewDistance: 25
                        }
                    },
                    title: {
                        text: data.email
                    },
                    subtitle: {
                        text: 'Cuisines'
                    },
                    plotOptions: {
                        column: {
                            depth: 25
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Orders Count'
                        },
                        allowDecimals: false
                    },
                    xAxis: {
                        categories: data.graphNameList
                    },
                    series: [{
                        name: 'Total Orders',
                        data: data.graphValueList
                    }]
                });
            }
        });
    }
});