var     mongoose = require('mongoose')
    ,   Schema = mongoose.Schema;

var Truck = Schema({
        name: String
    ,   email: String
    ,   password: String
    ,   phone: String
    ,   currentLocation: { type: [Number] } // --> **** NOTE **** MONGOOSE REQUIRES [LONG, LAT] FORMAT // GOOGLE MAPS REQUIRES OPPOSITE [LAT, LONG] //
    ,   genre: {type: String, enum: ['Mexican', 'Thai', 'American', 'Other']}
    ,   price: {type: String, enum: ['$', '$$', '$$$', '$$$$']}
    ,   createdAt: {type: Date, default: Date.now}
    ,   updatedAt_readable: String
    ,   website: String
    ,   imgUrl: String
    ,   status: String
    ,   role: {type: String, default: 'Truck', required: true}
});

module.exports = mongoose.model('Truck', Truck);