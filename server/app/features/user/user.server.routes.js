var UserCtrl = require('./user.server.controller');

module.exports = function (app) {

    app.route('/api/users')
        .get(UserCtrl.getAllUsers) // get all Users
        .post(UserCtrl.postNewUser); // post new User to db
    
    app.route('/api/users/trucks')
        .get(UserCtrl.getAllTrucks) // get all Users that contain a Food Truck (truck.truckName)
  
    
    app.route('/api/users/:id')
        .get(UserCtrl.getSpecificUser) // get a specific user
        .put(UserCtrl.updateSpecificUser) // update a specific User
        .delete(UserCtrl.deleteSpecificUser); // delete a specific User
        
    app.route('/api/active')
        .get(UserCtrl.getActiveTrucks) // get only ACTIVE truck data
            
    app.route('/api/users/truck/:id')
        .get(UserCtrl.getOneTruckData) // get data for only one truck
    
    app.route('/api/users/favs/:id')
        .put(UserCtrl.addFavorite) // add truck to favorites array
    
    app.route('/api/users/favs/remove/:id')
        .put(UserCtrl.removeFavorite) // remove truck from favorites array
};