var User = require('./user.server.model');

module.exports = {

    getAllTrucks: function (req, res, next) {
        // if (User.truck) {
            User.find().exec(function (error, trucks) {
                if (error) {
                    res.status(500).send(error);
                }
                res.status(200).json(trucks);
            });
        // }
    },

    postNewTruck: function (req, res, next) {
        new User(req.body).save(function (err, truck) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(truck);
        });
    },

    updateSpecificTruck: function (req, res, next) {
        console.log(req.body);
        User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, updatedTruck) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(updatedTruck);
        });
    },

    deleteSpecificTruck: function (req, res, next) {
        User.findByIdAndRemove(req.params.id, function (err, deletedTruck) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(deletedTruck);
        });
    },
    
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