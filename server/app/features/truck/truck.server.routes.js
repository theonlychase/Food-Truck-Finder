var TruckCtrl = require('./truck.server.controller');

module.exports = function (app) {

    app.route('/api/trucks')
        .get(TruckCtrl.getAllTrucks) // get all Trucks data
        .post(TruckCtrl.postNewTruck) // post new Truck to db
  
    
    app.route('/api/trucks/:id')
        .put(TruckCtrl.updateSpecificTruck) // update a specific Truck
        .delete(TruckCtrl.deleteSpecificTruck) // delete a specific Truck
    
    
};