var userCtrl = require('./user.server.controller');
    
    
   module.exports = function (app) {

    app.route('/api/users/:id')
        .put(userCtrl.addFavorites); // update a specific Truck

    
    
};