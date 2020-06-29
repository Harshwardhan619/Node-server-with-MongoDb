const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Leaders = require('../models/leaders');

const leaderRoute = express.Router();

leaderRoute.use(bodyParser.json());

leaderRoute.route('/')
    .get((req, res, next) => {
        Leaders.find({})
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.create(req.body)
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

leaderRoute.route('/:leaderId')
    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then((leader) => {
                if (leader != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(leader);
                }
                else {
                    err = new Error('Leader ' + req.params.leaderId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /leaders/'
            + req.params.leaderId );
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then((leader) => {
                if (leader != null) {
                    if (req.body.description) {
                        leader.description = req.body.description;
                    }
                    if (req.body.designation) {
                        leader.designation = req.body.designation;                
                    }
                    leader.save()
                    .then((leader) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(leader);                
                    }, (err) => next(err));
                }
                else {
                    err = new Error('Leader ' + req.params.leaderId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.deleteOne({_id : req.params.leaderId})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));  
    });


module.exports = leaderRoute;