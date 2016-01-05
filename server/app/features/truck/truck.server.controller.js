var Truck = require('./truck.server.model');

module.exports = {
    
  getAllTrucks: function(req, res, next) {
      Truck.find().exec(function(error, trucks) {
          if (error) {
              res.status(500).send(error);
          }
          res.status(200).json('yes it worked!');
      })
  }  
    
};