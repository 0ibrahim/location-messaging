var ref = new Firebase("https://luminous-torch-1983.firebaseio.com");
ref.onAuth(function(authData) {
	if (authData !== null) {
		console.log("Authenticated successfully with payload:", authData);
	} else {
		// Try to authenticate with Google via OAuth redirection
		ref.authWithOAuthRedirect("facebook", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			}
		});
	}
});