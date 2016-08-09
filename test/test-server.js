global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        server.runServer(function() {
            Item.create({name: 'Broad beans'},
                        {name: 'Tomatoes'},
                        {name: 'Peppers'}, function() {
                done();
            });
        });
    });
it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');                
                done();
            });
    })
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                //if there is not error
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on put', function(done) {
        chai.request(app)
            .put('/items/0')
            //we dont need to send an item because we already have put it above
            .send({'name': 'Potatoes'})
            // .send({'id': 0, 'name': 'Potatoes'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Potatoes');
                storage.items.should.be.a('array');
                storage.items.should.have.length(3);
                storage.items[0].should.be.a('object');
                storage.items[0].should.have.property('id');
                storage.items[0].should.have.property('name');
                storage.items[0].id.should.be.a('number');
                storage.items[0].id.should.equal(0);
                storage.items[0].name.should.be.a('string');
                storage.items[0].name.should.equal('Potatoes');                
                done();
            });
    });
    it('should delete an item on delete', function(done) {
        chai.request(app)
            .delete('/items/0')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                // this is the complete response
                res.should.be.json;
                res.body.should.be.a('array');
                storage.items.should.have.length(2);
                res.body[0].name.should.equal('Tomatoes');
                done();
            });
    });
    it('should not post to an id that exists', function(done) {
        chai.request(app)
            .post('/items/0')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                 should.not.equal(err, null);
                res.should.have.status(405);
                done();
            });
    });
    it('should not post without body data', function(done) {
        chai.request(app)
            .post('/items')
            .send({})
            .end(function(err, res) {
                should.not.equal(err, null);
                res.should.have.status(405);
                done();
            });
    });
    it('should not post with something other than a valid json', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                res.should.have.status(201);
                res.should.be.json;
               
                done();
            });
    });
    it('should not put without an id in the endpoint', function(done) {
        chai.request(app)
            .put('/items')
            .send({name: 'Potatoes'})
            .end(function(err, res) {
                res.should.not.have.status(200);
               
                done();
            });
    });
    it('should not put with different id in the endpoint than the body', function(done) {
        chai.request(app)
            .put('/items/1')
            .send({id: 2, name: 'Potatoes'})
            .end(function(err, res) {
                should.not.equal(err, null);
                res.should.have.status(405);
               
                done();
            });
    });
    it('should not put to an id that does not exist', function(done) {
        chai.request(app)
            .put('/items/5')
            .send({name: 'Potatoes'})
            .end(function(err, res) {
                should.not.equal(err, null);
                res.should.not.have.status(200);
                res.should.have.status(404);
                done();
        });
    });
    it('should not put without body data', function(done) {
        chai.request(app)
            .put('/items')
            .end(function(err, res) {
                should.not.equal(err, null);
                res.should.have.status(405);
                done();
    });
    });
    it('should not put with something other than valid json', function(done) {
        chai.request(app)
            .put('/items')
            .send('rabbit')        
            .end(function(err, res) {
                should.not.equal(err, null);
                res.should.have.status(405);
                done();
            });
    });
    it('should not delete an id that does not exist', function(done) {
        chai.request(app)
            .delete('/items/999')
            .end(function(err, res) {
                should.not.equal(err, null);
                res.should.have.status(404);
                done();
            });
    });
    it('should not delete without an id in the endpoint', function(done) {
        chai.request(app)
            .delete('/items')
            .end(function(err, res) {
                should.not.equal(err, null);
                res.should.have.status(405);
                res.should.not.have.status(200);
                done();
            });
    });
    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});