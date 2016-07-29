var express = require('express');
var router = express.Router();
var request = require('request');
var constants = require('../constants');

router.get('/',function (req,res,next) {
    
    var phoneNumber = req.query.phoneNumber;
    var latitude = req.query.lat;
    var longitude = req.query.lng;
    var mess = 'message';

    getLocationFromGoogleApi(latitude,longitude,phoneNumber,res,sendSmsToUser);
});

var getLocationFromGoogleApi = function (latitude,longitude,phone,response,sendSmsToUser) {
    
    var place_api_url = constants.google_maps_api_url + "location=" + latitude + "," + longitude +"&radius=20000&type=car_repair&key="+constants.api_key;

    request(place_api_url,function (err,res,body) {
        if (err){
            console.log('error');
            response.send({status:801,message:'Error Connecting To API'});
        }
        else{

            var json = JSON.parse(body);
            var results_array = json.results;
            var place_name = results_array[0].name;
            var place_address = results_array[0].vicinity;
            var location = results_array[0].geometry.location;
            var distance = getDistanceFromLatLonInKm(latitude,longitude,location.lat,location.lng);

            var mess = "Nearest Repair is : "+distance +"kms. away "+ place_name +" "+ place_address;
            sendSmsToUser(phone,mess,response);
            
        }
    });


};

var sendSmsToUser = function (phone,message,response) {
    var sms_api_url = 'http://api.textlocal.in/send/?username='+constants.sms_api_user+'&hash='+constants.sms_api_hash+'&sender='+constants.sms_api_sender+'&message='+message+'&numbers='+phone;
    request(sms_api_url , function (err,res,body) {
        if (err){
            console.log('error');
            response.send({status:801,message:'Error Connecting To API'});

        }
        else{
            console.log(body);
            response.send({status:'800',message:'Message Sent Successfully.'});
        }
    });
};

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}


module.exports = router;
