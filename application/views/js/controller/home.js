myApp.controller('homeController', function($scope, $rootScope, $location, NK_API, $window) {
    //UNCOMMENT THIS FOR PRODUCTION
    // jQuery.ajax({
    //     type: "GET",
    //     url: NK_API + "/angelHack/index.php/index/get_categories",
    //     contentType: "application/json",
    //     complete: function(data) {
    //         if (data.readyState == 4 && data.status == 200) {
    //             cat = JSON.parse(data.responseText); 
    //             console.log(cat);var html = "";
    //             for (var i = 0; i < cat.length; i++) {
    //                 html += "<option value='" + cat[i].category + "'>" + cat[i].category + "</option>";
    //             }


    //             $('#cuisine').append(html);
    //             $('select').material_select('destroy');
    //             $('select').material_select();
    //         } else {
    //             console.log("error");
    //         }
    //     }
    // });
    $("#sub-cat-button").click(function() {
        var parent_cat=$("#cuisine").val();
        console.log(parent_cat);
        // var url = "/angelHack/index.php/index/get_sub_categories/"+parent_cat;
        //UNCOMMENT 
        // jQuery.ajax({
        //     type: "GET",
        //     url: NK_API + "/angelHack/index.php/index/get_sub_categories/"+parent_cat,
        //     contentType: "application/json",
        //     complete: function(data) {
        //         if (data.readyState == 4 && data.status == 200) {
        //             console.log(data.responseText);
        //             sub_cat = JSON.parse(data.responseText); 
        //             console.log(sub_cat);var html2 = "";
        //             for (var i = 0; i < sub_cat.length; i++) {
        //                 html2 += "<option value='" + sub_cat[i].sub_category + "'>" + sub_cat[i].sub_category + "</option>";
        //             }


        //             $('#sub-cat').append(html2);
        //             $('select').material_select('destroy');
        //             $('select').material_select();
        //         } else {
        //             console.log("error");
        //         }
        //     }
        // });

    });
    $("#submit").click(function() {
        var cuisine = $("#cuisine").val();
        var name = $("#name").val();
        var mobile = $("#mobile").val();
        var email = $("#email").val();
        var cuisine_bool = false;
        if (cuisine == undefined || cuisine == null || cuisine == [] || cuisine == "") {
            sweetAlert("error", "Select a cuisine from list", "error");
        } else {
            cuisine_bool = true;
        }
        var name_bool = false;
        if (name == undefined || name == null || name == "") {
            sweetAlert("error", "Type customer name", "error");
        } else {
            name_bool = true;
        }
        var mobile_bool = false;
        if (mobile == undefined || mobile == null || mobile == "") {
            sweetAlert("error", "Type customer mobile", "error");
        } else {
            mobile_bool = true;
        }
        var email_bool = false;
        if (email == undefined || email == null || email == "") {
            sweetAlert("error", "Type customer email", "error");
        } else {
            email_bool = true;
        }
        if(cuisine_bool && name_bool && mobile_bool && email_bool) {
            for (var i = 0; i < cuisine.length; i++) {
                cuisine[i] = parseInt(cuisine[i]);
            }
            var params = {
                "cuisineIdList": cuisine,
                "user": {
                    "mobileNumber": mobile,
                    "email": email,
                    "name": name,
                },
                "partner": {
                    "id": 1
                }
            };
            // jQuery.ajax({
            //     type: "POST",
            //     url: NK_API + "/subscription/save",
            //     contentType: "application/json",
            //     data: JSON.stringify(params),
            //     complete: function(data) {
            //         if (data.readyState == 4 && data.status == 200) {
            //             sweetAlert("Success", "Order Added Successfully", "success");
            //         } else {
            //             console.log("error");
            //         }
            //     }
            // });
        }
    });
    function statusChangeCallback(response) {
        if (response.status === 'connected') {
            var accessToken = response['authResponse']['accessToken'];
            testAPI();
        } else if (response.status === 'not_authorized') {
            console.log('Please log into this app.');
        } else {
            console.log('Please log into Facebook.');
        }
    }
    function checkLoginState() {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }
    window.fbAsyncInit = function() {
        FB.init({
            appId: '1130969596922210',
            cookie: true,
            xfbml: true,
            version: 'v2.5'
        });
        FB.login(function(response) {
            // handle the response
        }, {
            scope: 'user_likes,email,user_posts',
            return_scopes: true
        });
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    };
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    var rest_name = []; var created_time_array = []; var feed = []; var userID; var emailID;var msg = []; var msg_final;

    function testAPI() {
        FB.api('/me', { fields: 'name, email' }, function(response) {
            userID = response['id'];
            emailID = response['email'];
        });
        FB.api('/me/feed?fields=place,created_time', {
            "with": "location"
        }, function(response) {
            var loop_length = response.data.length;
            recursiveGraphAPI(0, loop_length, response);
        });

        
    }

    function msgAPI() {

        FB.api('/me/feed?fields=message', 
        function(response) {
            console.log(response);
            var len =response.data.length;
            for (var i = 0; i < len; i++) {
            
                msg_final += response.data[i].message + ',';

            }
            console.log(msg_final);
            
        });
        
        
    }

    



    function recursiveGraphAPI(index, loop_length, response_loop) {
        feed.push(response_loop.data[index]['place']['id']);
        var place_name = response_loop.data[index]['place']['name'];
        var created_time = response_loop.data[index]['created_time'];
        FB.api('/' + feed[index] + '?fields=category,place_topics', function(response) {
            var type = response['place_topics']['data']['0']['name'];
            type = type.toLowerCase();
            if (type.match('cafeteria') != null || type.match('cafe') != null || type.match('food') != null || type.match('pizza') != null || type.match('coffee') != null || type.match('beverages') != null || type.match('restaurant') != null) {
                rest_name.push(place_name);
                created_time_array.push(created_time);
            }
            index++;
            if (index == loop_length - 1) {
                zomatoAPI(rest_name, created_time_array);
            } else {
                recursiveGraphAPI(index, loop_length, response_loop);
            }
        });
    }
    function zomatoAPI(restaurant, timestamp) {
        var restaurant_zomato = ''; var timestamp_zomato = '';
        for (var i = 0; i < restaurant.length; i++) {
            restaurant[i] = restaurant[i].trim();
            restaurant[i] = restaurant[i].replace(/[^a-zA-Z ]/g, "");
            restaurant[i] = restaurant[i].replace(/ /g, "%20");
            restaurant_zomato += restaurant[i] + ',';
        }
        restaurant_zomato = restaurant_zomato.slice(0, -1);
        for (var i = 0; i < timestamp.length; i++) {
            timestamp[i] = new Date(timestamp[i]);
            timestamp[i] = timestamp[i].getTime();
            timestamp_zomato += timestamp[i] + ',';
        }
        timestamp_zomato = timestamp_zomato.slice(0, -1);
        var json=JSON.stringify({
                "email": emailID,
                "restaurantNames": restaurant_zomato,
                "timestamp": timestamp_zomato
            });
        console.log(json);

        msgAPI();
        // jQuery.ajax({
        //     type: "POST",
        //     url: NK_API + "/subscription/placeOrder",
        //     contentType: "application/json",
        //     data: JSON.stringify({
        //         "email": emailID,
        //         "restaurantNames": restaurant_zomato,
        //         "timestamp": timestamp_zomato
        //     }),
        //     complete: function(data) {
        //         if (data.readyState == 4 && data.status == 200) {
        //             sweetAlert("Success", "Facebook profile scanned successfully", "success");
        //         } else {
        //             console.log("error");
        //         }
        //     }
        // });
    }
});