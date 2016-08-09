var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(id) {
    // use for in loop
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id ) {
            this.items.splice(i,1);
            return true;
        }
    }
    return false;
};

Storage.prototype.put = function(id, itemName) {
    console.log(id, itemName);
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
            this.items[i].name = itemName
            return true;
        }
    }
    return false;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');
console.log(storage.items);

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!request.body) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', function(request, response) {
    // console.log(response);
    var itemDidDelete = storage.delete(request.params.id);
    if (itemDidDelete) {
        response.status(200).json(request.params.id);
    }
    else {
        response.sendStatus(404);
    }

    
});

app.put('/items/:id', jsonParser, function(request, response) {
    console.log(request.body.name, request.body.id);
    console.log(storage.items);
    var putItem = storage.put(request.body.id, request.body.name);
    if (putItem) {
         response.status(200).json(request.body);
     }
     else {
         response.sendStatus(404);
     }
});
app.listen(process.env.PORT, process.env.IP);

exports.app = app;
exports.storage = storage;