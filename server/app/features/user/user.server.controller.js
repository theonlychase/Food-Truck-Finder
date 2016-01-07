var User = require('./user.server.model');

module.exports = {
  
    addFavorites: function (req, res, next) {
        User.findByIdAndUpdate(req.params.id, {$push: {favorites: req.body.favorites}}, { new: true }, function (err, updatedUser){
            console.log(req.body);
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(updatedUser);
        });
    }
    
};