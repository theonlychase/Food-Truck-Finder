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
    
    app.route('/api/users/favs/:id')
        .put(UserCtrl.addFavorite) // get a specific user
    
};