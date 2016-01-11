var User = require('./user.server.model');

module.exports = {

    getAllTrucks: function (req, res, next) {
        User.find().exists('truck.truckName', true).exec(function (error, users) {
            if (error) {
                res.status(500).send(error);
            }
            res.status(200).json(users);
        });
    },

    getAllUsers: function (req, res, next) {
        User.find().populate('favorites').exec(function (error, users) {
            if (error) {
                res.status(500).send(error);
            }
            res.status(200).json(users);
        });
    },

    getSpecificUser: function (req, res, next) {
        User.findById(req.params.id).populate('favorites').exec(function (error, user) {
            if (error) {
                res.status(500).send(error);
            }
            res.status(200).json(user);
        });
    },

    postNewUser: function (req, res, next) {
        new User(req.body).save(function (err, user) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(user);
        });
    },

    updateSpecificUser: function (req, res, next) {

        console.log("this is id", req.params.id);

        User.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }, function (err, updatedUser) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(updatedUser);
        });
    },

    addFavorite: function (req, res, next) {
        User.findByIdAndUpdate(req.params.id, {
            $push: {
                'favorites': req.body.id
            }
        }, {
            new: true
        }, function (err, updatedUser) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(updatedUser);
        });
    },

    deleteSpecificUser: function (req, res, next) {
        User.findByIdAndRemove(req.params.id, function (err, deletedUser) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(deletedUser);
        });
    },

    getActiveTrucks: function (req, res, next) {
        User.find().exists('truck.truckName', true).where('truck.status').equals('Active').select('truck').exec(function (error, trucks) {
            if (error) {
                res.status(500).send(error);
            }
            res.status(200).json(trucks);
        });
    },

    getOneTruckData: function (req, res, next) {
        User.findById(req.params.id).select('truck').exec(function (error, truck) {
            if (error) {
                res.status(500).send(error);
            }
            res.status(200).json(truck);
        });
    },

};