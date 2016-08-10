/**
 * Created by Brekkishhh on 10-08-2016.
 */

var express = require('express');
var router = express.Router();


router.get('/',function (req,res,next) {
    console.log('socket server started');
});

module.exports = router;