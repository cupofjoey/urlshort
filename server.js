
var express = require('express');
var app = express();
var mongo = require('mongodb');



var url = 'mongodb://localhost:27017/shortdb';

// Use connect method to connect to the Server
mongo.connect(url, function (err, db) {
	if (err) throw err;

	app.get('/', function (req, res) {
		res.send("Hello World")
	});
    
    app.get('/:animal', function(req, res){
    	res.send("A " + req.params.animal);
    });

    //Close connection
    //db.close();
  
});



app.listen(process.env.PORT || 5000);