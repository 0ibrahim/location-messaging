var firebaseRef = new Firebase("https://luminous-torch-1983.firebaseio.com/");
var groupsRef = new Firebase(firebaseRef + "groups/");
var geoRef = new Firebase(firebaseRef + "geo/");
var geoFire = new GeoFire(geoRef);

var RADIUS = 10.5;

function createGroup(groupName) {
	// Should make sure the name doesn't already exist!
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			var groupID = groupsRef.push({
				name: groupName, 
				location: [latitude, longitude]
				viewcount: 0
			});
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
document.getElementById('new-group').onclick = function() {createGroup('testing')};

function getGroups() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getGroupFromPosition);
	} else {
		alert("Geolocation is not supported!");
	}
}
document.getElementById('near-me').onclick = getGroups

function getGroupFromPosition(position) {
	var geoQuery = geoFire.query({
		center: [position.coords.latitude, position.coords.longitude],
		radius: RADIUS,
	});
	var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
	  console.log(key + " entered query at " + location + " (" + distance + " km from center)");
	});
}

function increaseViewcount(groupID) {
	var viewcountRef = new Firebase(firebaseRefUrl + "groups/" + groupID + "/viewcount");
	viewcountRef.transaction(function(currentValue) {
		return (currentValue || 0) + 1;
	});
}

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
	$.get( "static_pages/show_group.html", function( data ) {
		$("body").html(data);
		$("#groupName").text("My Group");
		$("#groupMessages").text("Random text");
		var groupRef = new firebase(groupsRef + groupID);
	});
}
