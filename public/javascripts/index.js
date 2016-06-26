var time_zone = 1000 * (new Date().getTimezoneOffset())*(-60);
var month_names = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Avg", "Sen", "Oct", "Nov", "Dec"];
var city_name_list = [];

$(document).ready(function(){
});

$('#cur_city').click(function(){
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getCurrentCity);
	} else {
		$('#error').html("Geolocation is not supported by this browser.");
	}
});

function getCurrentCity(position) {
	var lat = position.coords.latitude;
	var long = position.coords.longitude;
	$.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + long + "&mode=json&cnt=14&appid=75e843de569fb57a783c2e73fd9a7bb5", getCurrentCityWeather);
}

$('#add_city').click(function () {	
	var $city_name = $('#city_name').val();
	$city_name = capitalizeMe($city_name);
	$('#city_name').val($city_name);
	$.ajax({
		url: '/get_data',
		type:'POST',
		data:
		{
			city_name: $city_name,
		},
		success: function(data)
		{
			if(data.success){
				getCityWeather(data.success);
			}
			else {
				console.log(data.error);
				$('#error').html(data.error);
			}
		},       
		error: function(data)
		{
			console.log(data);
			$('#error').html(data);	
		}
	});
	$('#error').val('');
});

function getCityWeather(data){
	var $city_name = $('#city_name').val();
	$('#city_name').val('');	
	console.log(data);
	displayWeather(data, $city_name);

}

function getCurrentCityWeather(data){
	var $city_name = data.city.name;
	displayWeather(data, $city_name);	
}

function displayWeather(data, city_name){
	if(data.city.name == city_name){
		if(city_name_list.indexOf(city_name) == -1){
			city_name_list.push(city_name);
			append_data(data);
		}
		else {
			$('#error').html('City already displayed');	
		}
	}
	else {
		$('#error').html('Check the city name');
	}
}

function capitalizeMe(val){
	return val.charAt(0).toUpperCase()+val.substr(1).toLowerCase();
}

function append_data(data){
	var forecast = data.list;
	var append_data = '';	
	append_data = '<div class = "col-md-3 my_weather well">';
	append_data += '<h4><p class="well lead" id="cityarea">' + data.city.name + '</p></h4>';
	append_data += '<table class = "table">';

	for(var i = 0; i < forecast.length; i++){
		var dt = new Date(forecast[i].dt * 1000 + time_zone);
		var day =dt.getDate() +' '+ month_names[dt.getMonth()];

		var temp = forecast[i].temp.day;
		var night = forecast[i].temp.night;			
		var text = forecast[i].weather[0].description;

		append_data += '<tr>';
		append_data += '<td>' + day + '</td>';
		append_data += '<td>Max: <span class="label label-success">' + temp + ' °C</span>   Min: <span class="label label-warning">' + night + '°C</span><br><p id="weather_text">' + text + '</p></td>';
		append_data += '</tr>';

	}
	append_data += '</table>'
	append_data += '</div>';

	$('#display_area').append(append_data);	
}