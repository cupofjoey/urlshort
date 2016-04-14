
var express = require('express');
var app = express();
var mongo = require('mongodb');

//var exampleUrlDocument = {originalUrl: "https://www.google.com", shortUrl, "12345"};

var url = 'mongodb://localhost:27017/shortdb';

// Use connect method to connect to the Server
mongo.connect(process.env.MONGOLAB_URI || url, function (err, db) {
	if (err) throw err;
    var urlCollection = db.collection('urls');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

	app.get('/', function (req, res) {
		res.sendFile(__dirname + "/index.html");
	});
    
    app.get('/urls/new', function (req, res) {
    	var fullUrl = req.query.fullUrl;
        if(validUrl(fullUrl)) {
            var urlDocument = {
                originalUrl: fullUrl,
                shortUrl: randomFive()
            }
            
            urlCollection.insertOne(urlDocument, function (err, result) {
                if (err) throw err;
                res.send(result.ops[0]);
            });

        } else {
            res.send("Bad!");
        }

    });

    app.get('/urls/:url', function (req, res) {
        var shortenedUrl = +req.params.url;
        if(shortenedUrl) {
            var query = {"shortUrl": shortenedUrl};
            urlCollection.findOne(query, function (err, result) {
                if (err) throw err;
                res.redirect(301, result.originalUrl);
            });
        } else {
            res.send("Error: please enter a valid 5 digit number");
        }

    });
    
    app.listen(process.env.PORT || 5000);
});






var randomFive = function() {
    return Math.floor(Math.random() * 90000) + 10000;
}

//Regex thankfully obtained from this gist: https://gist.github.com/dperini/729294
var validUrl = function(url){
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
    return regex.test(url)
}