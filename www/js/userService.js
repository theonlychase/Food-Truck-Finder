angular.module('food-truck-finder')	
.service('userService', function( $http ) {


	this.getUser = function(user) {
		//using post here as a "get""
		return $http.post('/api/getUser', user).then(function( response ) {
			return response.data[0];
		});		
	}

	this.udpateUser = function( id ) { 
		// console.log("userService userId: ", id);
		return $http.put('/api/user/' + id).then(function( response ) {
			console.log(response);
			return response.data;
		});
	}

	this.deleteUser = function( id ) {
		// console.log("userService userId: ", id);
		return $http.delete('/api/user/' + id).then(function( response ) {
			console.log(response);
			return response.data;
		});
	}




   
//end    
});