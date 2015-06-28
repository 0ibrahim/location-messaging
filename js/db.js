var firebaseRef = new Firebase("https://luminous-torch-1983.firebaseio.com/");
var groupsRef = new Firebase(firebaseRef + "groups/");
var geoFire = new GeoFire(firebaseRef);

var groupRef;
var curGroupID;
var messagesRef;

var RADIUS = 10.5;

function createGroup(groupName) {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
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

function getGroups() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getGroupFromPosition);
	} else {
		alert("Geolocation is not supported!");
	}
}

// Should not be called multiple times
function getGroupFromPosition(position) {
	var geoQuery = geoFire.query({
		center: [position.coords.latitude, position.coords.longitude],
		radius: RADIUS,
	});
	var onReadyRegistration = geoQuery.on("ready", function() {
	  console.log("GeoQuery has loaded and fired all other events for initial data");
	});
	var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
	  console.log(key + " entered query at " + location + " (" + distance + " km from center)");
	});
}

document.getElementById('new-group').onclick = function() {createGroup('testing')};

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

function renderGroup(groupID) {
	curGroupID = groupID;
	$.get( "static_pages/show_group.html", function( data ) {
		$("#container").html(data);
		$("#groupName").text("My Group");
		$("#groupMessages").text("Random text");
	});
}
