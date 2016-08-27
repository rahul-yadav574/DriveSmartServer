/**
 * Created by Brekkishhh on 25-08-2016.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');


router.get('/',function (req,res,next) {

    var query = req.query.q;

    if (query == null){
        res.send({status:false,data:'The bot needs a query parameter and type separated by _(underscore)'});
    }
    var index = query.indexOf('_');
    var type = query.substr(index+1,query.length);
    var search_query = query.substr(0,index);

    if(type == 'text' || type == 'image' || type == 'video'){

        switch (type){
            case 'text':
                retreiveAndSendText(search_query,res);
                break;
            case 'image':
                retreiveAndSendImages(search_query,res);
                break;
            case 'video':
                retreiveAndSendVideos(search_query,res);
                break;
        }
    }else{
        res.send({status:false,data:'The bot needs a query parameter and type separated by _(underscore)'});
    }


});

router.post('/',function (req,res,next) {

    var encoded_image = req.body.q;
    var bitmap = new Buffer(encoded_image,'base64');
   
    var api_url =  'https://api.havenondemand.com/1/api/sync/ocrdocument/v1';
    
    request({
        url:api_url,
        method:'POST',
        form:{apikey:'439a27da-a17c-410c-9201-b8e12f6ddade'}

    },
        function (error,response,body) {
            if (error){
                res.send({status:false,data:body});
            }else{
                res.send({status:true,data:body,type:'text_message'});
            }
        }
    );



});


var retreiveAndSendText = function (search_query,response) {

    var api_url = 'https://api.havenondemand.com/1/api/sync/querytextindex/v1?ignore_operators=false&promotion=false&summary=concept&summary_length=500&total_results=false&apikey=439a27da-a17c-410c-9201-b8e12f6ddade&text='+search_query;

    request(api_url,function (err,res,body) {

        if (err){
            response.send({status:false,data:'Unable To Get Data .....There Must Be Some Problem With The Bot'});
        }

        else{
            var json_res = JSON.parse(body);
            var all_res = json_res.documents;
            var best_match = all_res[0].summary;
            response.send({status:true,data:best_match,type:'text_message'});
        }
    });
};

var retreiveAndSendImages = function (search_query,response) {

    var api_url = 'https://api.gettyimages.com:443/v3/search/images?phrase='+search_query;
    console.log(api_url);
    var api_key = 'ff8xpktm56j5h7x3hjybcauv';


    request({
        url: api_url, //URL to hit
        method: 'GET',
        headers: {
            "Api-Key":api_key
        }
    }, function(error, res, body){
        if(error) {
            response.send({status:false,data:'Unable To Get Data .....There Must Be Some Problem With The Bot'});
        } else {

            var json_res = JSON.parse(body);

            if (json_res.result_count == 0){
                response.send({status:true,data:'Try Using Another Name ....Bot Is Confused',type:'text_message'});
            }

            else {
                var result = json_res.images[0].display_sizes[0].uri;

                response.send({status:true,data:result,type:'image_message'});
            }

        }
    });

};

var retreiveAndSendVideos = function (search_query,response) {

    var api_url = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyDYHQa0UeZrWcsDdpsFJAaaJXQPvFwH0C4&type=video&part=snippet&type=video&q='+search_query;

    
    request(api_url,function (err,res,body) {

        if (err){
            response.send({status:false,data:'Unable To Get Data .....There Must Be Some Problem With The Bot'});
        }

        else{
            var json_res = JSON.parse(body);
            var all_res = json_res.items;
            var best_match = all_res[0].id.videoId;
            response.send({status:true,data:best_match,type:'video_message'});


        }
    });
};

module.exports = router;