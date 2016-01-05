var TruckCtrl = require('./truck.server.controller');

module.exports = function(app) {
    
  app.route('/api/trucks')
    .get(TruckCtrl.getAllTrucks)
  
  console.log('skittles');
    
    
};