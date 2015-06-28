var firebaseRef = new Firebase("https://luminous-torch-1983.firebaseio.com/");
var geoFire = new GeoFire(firebaseRef);

function createGroup(groupName) {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
			firebaseRef.push({name: groupName, location: [latitude, longitude]});
			geoFire.set(groupName, [latitude, longitude]).then(function() {
			  console.log("Provided key has been added to GeoFire");
			}, function(error) {
			  console.log("Error: " + error);
			});
		})
	} else {
		alert("Geolocation is not supported!");
	}
}

document.getElementById('new-group').onclick = createGroup('testing');