var Truck = require('./truck.server.model');

module.exports = {

    getAllTrucks: function (req, res, next) {
        Truck.find().exec(function (error, trucks) {
            if (error) {
                res.status(500).send(error);
            }
            res.status(200).json(trucks);
        })
    },

    postNewTruck: function (req, res, next) {
        new Truck(req.body).save(function (err, truck) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(truck);
        })
    },

    updateSpecificTruck: function (req, res, next) {
        Truck.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, updatedTruck) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(updatedTruck);
        })
    },

    deleteSpecificTruck: function (req, res, next) {
        Truck.findByIdAndRemove(req.params.id, function (err, deletedTruck) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(deletedTruck);
        })
    }

};