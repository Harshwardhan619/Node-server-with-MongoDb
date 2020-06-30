const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
const Favorites = require('../models/favorite');
var cors = require('./cors');
const favRouter = express.Router();

favRouter.use(bodyParser.json());

favRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    // console.log("decoded :" , req.user);
    Favorites.find({user : req.user.id})
    .populate('dishes')
    .populate('user')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    var body = req.body.map((x) => x._id);
    Favorites.findOne({user : req.user.id})
    .then(function(favorites){
        // console.log(body);
        // console.log(favorites, favorites !=null);
        if(favorites != null){
            console.log("not-null");
            Favorites.update(
                {_id : favorites._id},
                {$addToSet : {'dishes' : body}}
            )
            .then( function(updated){
                // console.log(favorites);
                Favorites.findById(favorites._id)
                .populate('dishes')
                .populate('user')
                .then((x) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(x);
                });
            }, (err) => {next(err)});
        }
        else {
            console.log("isnull");
            Favorites.create({'user' : req.user.id, 'dishes' : body})
            .then((favorites) => {
                Favorites.findById(favorites._id)
                .populate('dishes')
                .populate('user')
                .then((x) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(x);
                });
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        // res.json(favorites);
    }, (err) => next(err))
    .catch(function(err) {next(err);});
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({user : req.user.id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favRouter.route('/:favId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser,  (req,res,next) => {
    // Favorites.findById({user : req.user.id})
    // .populate('comments.author')
    // .then((dish) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(dish);
    // }, (err) => next(err))
    // .catch((err) => next(err));
    res.statusCode = 403;
    res.end('GET operation not supported on /Favorites/'
        + req.params.favId );
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    body = [req.params.favId];
    Favorites.findOne({user : req.user.id})
    .then(function(favorites){
        // console.log(body);
        // console.log(favorites, favorites !=null);
        if(favorites != null){
            console.log("not-null");
            Favorites.update(
                {_id : favorites._id},
                {$addToSet : {'dishes' : body}}
            )
            .then( function(updated){
                // console.log(favorites);
                Favorites.findById(favorites._id)
                .populate('dishes')
                .populate('user')
                .then((x) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(x);
                });
            }, (err) => {next(err)});
        }
        else {
            console.log("isnull");
            Favorites.create({'user' : req.user.id, 'dishes' : body})
            .then((favorites) => {
                Favorites.findById(favorites._id)
                .populate('dishes')
                .populate('user')
                .then((x) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(x);
                });
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        // res.json(favorites);
    }, (err) => next(err))
    .catch(function(err) {next(err);});
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Favorites/'
        + req.params.favId );
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user.id})
    .then((favorites) => {
        favorites.dishes.pull(req.params.favId);
        console.log(favorites.dishes.length);
        if(favorites.dishes.length == 0){
            Favorites.remove({user : req.user.id})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));   
        }
        else{
            favorites.save().then(
                (x) => {
                    Favorites.findById(favorites._id)
                    .populate('dishes')
                    .populate('user')
                    .then((x) =>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(x);
                    });
                }
            )
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
});


module.exports = favRouter;