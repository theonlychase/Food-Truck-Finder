var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./server/config/database'); // get db config file
var User = require('./server/app/features/user/user.server.model'); // get the USER model
var port = process.env.PORT || 80;
var jwt = require('jwt-simple');


// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SOCKET.IO //
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Cors
app.use(cors());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// demo Route (GET http://localhost:8080)
app.get('/api/test', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

///Require Truck Routes///


///Require User Routes////
require('./server/app/features/user/user.server.routes')(app);
console.log('test server');

mongoose.connect(config.database);

require('./server/config/passport')(passport);

var apiRoutes = express.Router();

apiRoutes.put('/truckprofile/:id', function(req, res) {
   User.findByIdAndUpdate(req.params.id, {truck: req.body}, {new: true}, function(err, response) {
       console.log("req.params.id is ", req.params.id);
       console.log("req.body is ", req.body);
           if(err) {
               res.json({success: false, msg: 'Updated Profile Settings Failed.'});
           } else {
               res.json({success: true, msg: 'Profile Settings Saved!', updatedTruck: response});
           }
       });
   });

apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({succes: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      role: req.body.role
    });
    console.log("what is the user?", newUser);
    newUser.save(function(err) {
      if (err) {
        res.json({succes: false, msg: 'Username already exists.'});
      } else {
        res.json({succes: true, msg: 'Successful created user!'});
      }
    });
  }
});

apiRoutes.post('/authenticate', function (req, res) {
    User.findOne({
        name: req.body.name
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, config.secret);
                    res.json({ success: true, token: 'JWT ' + token });
                } else {
                    res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    });
});

apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false }), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function (err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
            } else {
                return res.json({ success: true, user });
            }
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No token provided.' });
    }
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

app.use('/api', apiRoutes);

// SOCKET.IO //
io.on('connection', function (socket) {
    console.log('User connected to socket', socket.id);
    socket.on('notifyUpdatedTruck', function (truckToUpdateId) {
        console.log('Id of truck that needs to be updated by others ', truckToUpdateId);
        socket.broadcast.emit('updateThisTruck', truckToUpdateId);
    });
});

app.use(express.static(__dirname + '/www'));

// Start the server
http.listen(port, function () {
    console.log('Food Truck Finder Port: http://localhost:' + port);
});