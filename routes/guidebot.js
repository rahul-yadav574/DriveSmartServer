/**
 * Created by Brekkishhh on 25-08-2016.
 */
var express = require('express');
var router = express.Router();
var request = require('request');


router.get('/',function (req,res,next) {

    var query = req.query.q;

    if (query == null){
        res.send({status:false,data:'The bot needs a query parameter and type separated by _(underscore)'});
    }
    var index = query.indexOf('_');
    var type = query.substr(index+1,query.length);

    if(type == 'text' || type == 'image' || type == 'video'){
        res.send(type);
    }else{
        res.send({status:false,data:'The bot needs a query parameter and type separated by _(underscore)'});
    }


});

module.exports = router;