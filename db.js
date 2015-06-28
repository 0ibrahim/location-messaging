var firebaseRef = new Firebase("https://luminous-torch-1983.firebaseio.com/");
var geoFire = new GeoFire(firebaseRef);

function createGroup(groupName) {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
			firebaseRef.push({name: groupName, location: [latitude, longitude]});
		})
	} else {
		alert("Geolocation is not supported!");
	}
}

document.getElementById('new-group').onclick = createGroup('testing');

function addMessageToGroup(groupID, data, format) {
	if(groupID && data) {
		var groupRef = firebaseRef.child(groupID);
		var messagesRef = groupRef.child(messages);
		messagesRef.push({userid: auth.id, format: format, data: data});	
	}
	else {
		alert("Error");
		return
	}
}