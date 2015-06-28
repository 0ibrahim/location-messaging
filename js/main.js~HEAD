var firebaseRefURL = "https://luminous-torch-1983.firebaseio.com/";
var firebaseRef = new Firebase("https://luminous-torch-1983.firebaseio.com/");
var groupsRef = new Firebase(firebaseRefURL + "groups/");
var geoRef = new Firebase(firebaseRefURL + "geo/");
var geoFire = new GeoFire(geoRef);

var curGroupID;

var RADIUS = 10.5;

function createGroup(groupName) {
	// Should make sure the name doesn't already exist!
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			var groupIDRef = groupsRef.push({
				name: groupName, 
				location: [latitude, longitude],
				viewcount: 0,
			});
			geoFire.set(groupIDRef.key(), [latitude, longitude]).then(function() {
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

function incrementViewcount(groupID) {
	var viewcountRef = new Firebase(firebaseRefUrl + "groups/" + groupID + "/viewcount");
	viewcountRef.transaction(function(currentValue) {
		return (currentValue || 0) + 1;
	});
}

function addMessageToGroup(authData, groupID, data, format) {
	if(groupID && data) {
		var groupRef = groupsRef.child(groupID);
		if(groupRef) {
			var messagesRef = groupRef.child("messages");
			messagesRef.push({
				name: authData.facebook.displayName,
				format: format, 
				data: data
			});	
		}
	}
	else {
		alert("Error");
		return;
	}
}

function showGroup(groupID) {
	curGroupID = groupID;
	$.get( "static_pages/show_group.html", function( data ) {
		$("#container").hide();
		$("#container").html(data);
		$("#container").show(500);
	});
}