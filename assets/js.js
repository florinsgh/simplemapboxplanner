/** Javascript for the Easy Mapbox Queries */

// Create a free account on https://www.mapbox.com/ - in the main screen of your account there's a "default public token", paste that below
const accesstoken = '';

$(document).ready(function(){
	$('body').on('click', '.rqitemremove', function(){
		$(this).parent().remove();

		resetresults();
		buttonstatus();
	});
});

function rquery(){
	var query = $('input#rquery').val();
	var length = query.length;
	if(length >= 3){
		var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+query+'.json?proximity=ip&types=locality%2Cplace%2Caddress&language=en&access_token='+accesstoken;
		jQuery.getJSON(url).done(function(data){
			$('.rqdd').html('');
			$('.rqdd').removeClass('hidden');

			jQuery.each(data.features, function(k,v){
				var foundlocation = '<div class="rqdditem" onclick="rqueryadd(\''+v.place_name+'\', \''+v.center[0]+'\', \''+v.center[1]+'\');">'+v.place_name+'</div>';
				$('.rqdd').append(foundlocation);
			});
		});
	}
}

function rqueryadd(locname, lat, long){
	$('.rqdd').addClass('hidden');
	var foundlocation = '<div class="rqitem" data-lat="'+lat+'" data-long="'+long+'">'+locname+'<span class="rqitemremove">x</span></div>';
	$('.rqresults').append(foundlocation);

	$('input#rquery').val('');

	resetresults();
	buttonstatus();
}

function resetresults(){
	$('.rqstats .distance span.value').html('0');
	$('.rqstats .time span.value').html('0');
	$('.mapimage').html('');
}

function buttonstatus(){
	var howmany = jQuery('.rqitem').length;
	
	if(howmany >= 2){ jQuery('.rqbutton').removeClass('disabled'); }
	else{ jQuery('.rqbutton').addClass('disabled'); }
}

function calculateroute(){
	const coords = [];
	$('.rqitem').each(function(){
		var lat = $(this).data('lat');
		var long = $(this).data('long');
		coords.push(lat +','+ long);
	});
	
	let urlcoords = coords.join(";");
	
	var mapboxurl = 'https://api.mapbox.com/directions/v5/mapbox/driving/'+urlcoords+'?alternatives=false&geometries=geojson&overview=simplified&steps=false&access_token='+accesstoken;
	jQuery.getJSON(mapboxurl).done(function(data){
		console.log(data.routes[0].geometry);
		var meters = data.routes[0].distance;
		var km = meters / 1000;
		km = km.toFixed(0);
		$('.rqstats .distance span.value').html(km);

		var seconds = data.routes[0].duration;
		var hours = seconds / (60 * 60); 
		hours = hours.toFixed(1);
		$('.rqstats .time span.value').html(hours);

		var geometry = JSON.stringify(data.routes[0].geometry);
		var routemapurl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson({"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":'+geometry+'}]})/auto/500x300?padding=30&access_token='+accesstoken;
		
		var mapimage = "<img src='"+routemapurl+"'>";
		$('.mapimage').html(mapimage);
	});
}