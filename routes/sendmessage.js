var express = require('express');
var router = express.Router();
var request = require('request');
router.get('/', function(req, res, next) {
  res.send('');
});

router.post('/',function (req,res,next) {
    
    var phoneNumber = req.body.phoneNumber;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    
});

module.exports = router;
