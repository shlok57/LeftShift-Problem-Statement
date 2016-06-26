var time_zone = 1000 * (new Date().getTimezoneOffset())*(-60);
var month_names = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Avg", "Sen", "Oct", "Nov", "Dec"];
var city_name_list = [];

$(document).ready(function(){
});

$('#add_city').click(function () {
	$('#error').val('');
	$('#city_name').val('');	
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
			getCityWeather(data.success);
		},       
		error: function(data)
		{
			console.log(data);
			$('#error').html(data);	
		}
	});
});

function getCityWeather(data){
	var forecast = data.list;
	var $city_name = $('#city_name').val();
	if(data.city.name == $city_name){
		if(city_name_list.indexOf($city_name) == -1){
			city_name_list.push($city_name);
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