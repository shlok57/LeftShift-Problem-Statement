var express = require('express');
var router = express.Router();
var city_name_done = [];
var http = require('http');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Weather App' });
});

router.post('/get_data', function(request, response){
	var city_name = request.body.city_name;
	console.log('city_name'+city_name);
	var options = {
		host : 'api.openweathermap.org',
		path : '/data/2.5/forecast/daily?q=' + city_name + '&mode=json&units=metric&cnt=14&appid=75e843de569fb57a783c2e73fd9a7bb5',
		method : 'GET'
	}
	var maybe = '';
	var req = http.request(options, function(res){
		var body = "";
		res.on('data', function(data) {
			body += data;
			console.log('Data'+data);
		});
		res.on('end', function() {
			maybe = JSON.parse(body);
			console.log(maybe);
			var data1 = {'success' : maybe}
			response.send(data1);
		});
	});
	req.on('error', function(e) {
		console.log('Problem with request: ' + e.message);
	});
	req.end();
});
module.exports = router;