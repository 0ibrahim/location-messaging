var firebaseRefURL = "https://luminous-torch-1983.firebaseio.com/";
var firebaseRef = new Firebase("https://luminous-torch-1983.firebaseio.com/");
var groupsRef = new Firebase(firebaseRefURL + "groups/");
var geoRef = new Firebase(firebaseRefURL + "geo/");
var geoFire = new GeoFire(geoRef);

var curGroupID;

var RADIUS = 10.5;

function createGroup(groupName) {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			var groupID = groupsRef.push({name: groupName, location: [latitude, longitude]});
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

function getGroupFromPosition(position) {
	var geoQuery = geoFire.query({
		center: [position.coords.latitude, position.coords.longitude],
		radius: RADIUS,
	});
	var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
	  console.log(key + " entered query at " + location + " (" + distance + " km from center)");
	});
}

document.getElementById('new-group').onclick = function() {createGroup('testing')};
document.getElementById('near-me').onclick = getGroups

function addMessageToGroup(groupID, data, format) {
	if(groupID && data) {
		groupRef = groupsRef.child(groupID);
		if(groupRef) {
			alert("here");
			var messagesRef = new Firebase(groupRef.toString() + "/messages/");
			messagesRef.push({userid: "test", format: format, data: data});	
		}
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
	});
}
