var UserCtrl = require('./user.server.controller');

module.exports = function (app) {

    app.route('/api/users')
        .get(UserCtrl.getAllUsers) // get all User data
        .post(UserCtrl.postNewUser); // post new User to db
  
    
    app.route('/api/users/:id')
        .get(UserCtrl.getSpecificUser) // get a specific user
        .put(UserCtrl.updateSpecificUser) // update a specific User
        .delete(UserCtrl.deleteSpecificUser); // delete a specific User
        
    app.route('/api/active')
        .get(UserCtrl.getActiveTrucks) // get only ACTIVE truck data
            
    app.route('/api/users/truck/:id')
        .get(UserCtrl.getOneTruckData) // get data for only one truck
    
};