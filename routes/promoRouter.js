const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Promotions.create(req.body)
            .then((promo) => {
                // console.log('Promotion Created ', promo);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res, next) => {
        Promotions.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

promoRouter.route('/:promoId')
    .get((req, res, next) => {
        // console.log("promoID : ", req.params.promoId)
        Promotions.findById(req.params.promoId)
            .then((promo) => {
                if (promo != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promo);
                }
                else {
                    err = new Error('Promotion ' + req.params.promoId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /promotions/'
            + req.params.promoId );
    })
    .put((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then((promo) => {
                if (promo != null) {
                    if (req.body.description) {
                        promo.description = req.body.description;
                    }
                    if (req.body.label) {
                        promo.label = req.body.label;                
                    }
                    promo.save()
                    .then((promo) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(promo);                
                    }, (err) => next(err));
                }
                else {
                    err = new Error('Promotion ' + req.params.promoId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Promotions.deleteOne({_id : req.params.promoId})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));  
    });


module.exports = promoRouter;