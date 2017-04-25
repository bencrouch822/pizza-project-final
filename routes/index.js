var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/pizza-project';
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pizza Home' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Pizza Signup' });
});

router.post('/signup', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    mongo.connect(dbUrl, function(err, db){
        if(err) {
            console.log("Unable to connect to the mongodb server", err);
            res.json(false);
        } else {
            var collection = db.collection('accounts');

            collection.insertOne({
                username: username,
                password: password
            }).then(function(r){
                if(r.insertedCount){
                    console.log("Insert success");
                } else {
                    console.log("Insert failed");
                }
                db.close();
                res.redirect('/');
            });
        }
    });   
});

router.get('/orderSummary', function(req, res){
    res.render('orders');
});


/* GET menu page. */
router.get('/menu', function(req, res, next) {
  res.render('menu', { title: 'Pizza Menu' });
});

//Connects to mongodb and returns (in json) the pizza objects
router.get('/getPizzas', function(req, res){
  mongo.connect(dbUrl, function(err, db){
        if(err) {
            console.log("Unable to connect to the mongodb server", err);
        } else {
            var collection = db.collection('pizzas');

            collection.find({}).toArray(function(err, result){
                if(err){
                    res.send(err);
                } else if(result.length){
                    console.log(result);
                    pizzas = result;
                } else {
                    console.log(`No results found`);
                }

                res.json(pizzas);
            });
        }
    });
});

//Handles saving orders to the database
router.post('/placeOrder', jsonParser, function(req, res){
    var phone = req.body.phone;
    var cart = req.body.cart;

    mongo.connect(dbUrl, function(err, db){
        if(err) {
            console.log("Unable to connect to the mongodb server", err);
            res.json(false);
        } else {
            var collection = db.collection('orders');

            collection.insertOne({
                phoneNumber: phone,
                orders: cart
            }).then(function(r){
                if(r.insertedCount){
                    console.log("Insert success");
                    res.json(true);
                } else {
                    console.log("Insert failed");
                    res.json(false);
                }
                db.close();
            });
        }
    });
});

router.post('/getOrderSummary', function(req, res){
    mongo.connect(dbUrl, function(err, db){
        if(err) {
            console.log("Unable to connect to the mongodb server", err);
        } else {
            var collection = db.collection('orders');

            collection.find({}).toArray(function(err, result){
                if(err){
                    res.send(err);
                } else if(result.length){
                    console.log(result);
                    pizzas = result;
                } else {
                    console.log(`No results found`);
                }

                res.json(pizzas);
            });
        }
    });
});

module.exports = router;
