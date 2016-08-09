var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');
var Item = require('./models/item');

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

//Routes: 

app.get('/items', function(req, res) {
    Item.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(items);
    });
});

app.post('/items', function(req, res) {
    Item.create({
        name: req.body.name
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

//req.params: targeting a specific Id / identify

//req.body : pass date with the request /change 

app.put('/items/:id', function(req, res) {
    Item.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, function(err, item) {
        if (err) {
            console.error("Could not update Item", req.body.name)
            return res.status(400).json({
                message: 'error'
            });
        }
        res.status(200).json(item);
    });
});

app.delete('/items/:id', function(req, res) {
    Item.findByIdAndRemove(req.params.id, function(err, item) {
        if (err) {
            console.error("Could not update Item", req.body.name)
            return res.status(400).json({
                message: 'error'
            });
        }
        res.status(200).json(item);
    });
});
app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

exports.app = app;
exports.runServer = runServer;