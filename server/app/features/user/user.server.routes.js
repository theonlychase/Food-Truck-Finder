var UserCtrl = require('./user.server.controller');

module.exports = function (app) {

    app.route('/api/users/trucks')
        .get(UserCtrl.getAllTrucks) // get all Trucks data
        .post(UserCtrl.postNewTruck) // post new Truck to db
  
    
    app.route('/api/users/trucks/:id')
        .put(UserCtrl.updateSpecificTruck) // update a specific Truck
        .delete(UserCtrl.deleteSpecificTruck) // delete a specific Truck
    
    
};