angular.module('food-truck-finder')	
.service('truckService', function( $http ) {


	this.getTruck = function(truck) {
		//using post here as a "get""
		return $http.post('/api/getTruck', truck).then(function( response ) {
			return response.data[0];
		});		
	}

	this.udpateTruck = function( id ) { 
		// console.log("truckService truckId: ", id);
		return $http.put('/api/truck/' + id).then(function( response ) {
			console.log(response);
			return response.data;
		});
	}


	this.deleteTruck = function( id ) {
		// console.log("truckService truckId: ", id);
		return $http.delete('/api/truck/' + id).then(function( response ) {
			console.log(response);
			return response.data;
		});
	}




   
//end    
});