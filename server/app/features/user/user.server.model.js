var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

// set up a mongoose model
var UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favorites: [{
        type: Schema.Types.ObjectId, ref: 'User',
        unique: true
    }],

    truck: {
        truckName: String,
        address: String,
        phone: String,
        currentLocation: { type: [Number] }, // --> **** NOTE **** MONGOOSE REQUIRES [LONG, LAT] FORMAT // GOOGLE MAPS REQUIRES OPPOSITE [LAT, LONG] //
        genre: { type: String, enum: ['Mexican', 'Thai', 'American', 'Other'] },
        price: { type: String, enum: ['$', '$$', '$$$', '$$$$'] },
        createdAt: { type: Date, default: Date.now },
        updatedAt_readable: String,
        website: String,
        imgUrl: String,
        description: String, 
        status: { type: String }
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
