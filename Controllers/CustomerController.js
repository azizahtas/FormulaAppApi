var express = require('express');
var CustomerRouter = express.Router();
var passport =require('passport');
var jwt =require('jwt-simple');
var config = require('../config');
var constraints = config.Constants;
var User = require('../Models/User');
var Customer = require('../Models/Customer');

CustomerRouter.use('*',function (req, res, next) {
    console.log('Inside Customer Controller!');
    next();
});

CustomerRouter
    .get('/page/:_page',function (req, res, next) {
        passport.authenticate('jwt', function(err, user, info) {
            if (err) { return next(err); }
            else if (!user) { return  res.json({'success': false, 'msg': 'ErrorU404', data: []}); }
            else{
                var page = req.params['_page'];
                Customer.getCustomersByUserIdPaged(page,user._id,function (err,Customers) {
                    if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Retrieving Customers for User : '+user.fname+' '+user.lname , data:[]});}
                    else{res.json({'success': true, 'msg' : 'We Found What you were looking for!', data:Customers});}
                });
            }
        })(req,res,next);
    })
    .post('/',function (req, res, next) {
        passport.authenticate('jwt', function(err, user, info) {
            if (err) { return next(err); }
            else if (!user) { return  res.json({'success': false, 'msg': 'ErrorU404', data: []}); }
            else {
                var token = this.getToken(req.headers);
                if (token) {
                        var newCust = req.body;
                        newCust._UId = user._id;
                        Customer.addCustomer(newCust, function (err, Customer) {
                            if (err) {
                                console.log('Error Saving Customer :' + err);
                                res.json({'success': false, 'msg': 'Error Saving Customer!', data:[]});
                            }
                            else {
                                res.json({'success': true, 'msg': 'Customer Saved Successfully', data:[]});
                            }
                        });
                }
            }
        })(req,res,next);
    });

CustomerRouter
    .get('/Id/:_id',function (req, res, next) {
        passport.authenticate('jwt', function(err, user, info) {
            if (err) { return next(err); }
            else if (!user) { return  res.json({'success': false, 'msg': 'ErrorU404', data: []}); }
            else {
                var token = this.getToken(req.headers);
                if (token) {
                    var cid = req.params['_id'];
                    Customer.getUserCustomerById(user._id,cid,function (err,data) {
                        if(err){console.log('Error :'+err); res.json({'success': false, 'msg': 'Sorry We Could not get the Customer with the Id!', data: []});}
                        res.json({'success': true, 'msg': 'We Found What You Are Looking For!', data: [data]});
                    });
                }
            }
        })(req,res,next);
    })
    .delete('/Id/:_id',function (req, res, next) {
        passport.authenticate('jwt', function(err, user, info) {
            if (err) { return next(err); }
            else if (!user) { return  res.json({'success': false, 'msg': 'ErrorU404', data: []}); }
            else {
                var token = this.getToken(req.headers);
                if (token) {
                    var fid = req.params['_id'];
                    Customer.deleteUserCustomerById(user._id,fid,function (err,data) {
                        if(err){console.log('Error :'+err); res.json({'success': false, 'msg': 'We Could Not Delete Customer With Id!', data: []});}
                        else{res.json({'success': true, 'msg': 'Customer With Name '+data.Name+' Deleted Successfully!', data: []});}
                    });
                }
            }
        })(req,res,next);
    }).put('/Id/:_id',function (req, res,next) {
    passport.authenticate('jwt', function(err, user, info) {
        if (err) { return next(err); }
        else if (!user) { return  res.json({'success': false, 'msg': 'ErrorU404', data: []}); }
        else {
            var cid = req.params['_id'];
            var customer = req.body;
            Customer.UpdateUserCustomerById(user._id,cid, customer, function (err, customer) {
                if (err) {
                    console.log('Error :' + err);
                    res.json({'success': false, 'msg': 'We Couldnt Edit Customer With Id!', data: []});
                }
                res.json({'success': true, 'msg': 'Customer Updated Successfully!', data: []});
            });
        }
    })(req,res,next);
});
//Routes With /search/Option/term
CustomerRouter
    .get('/search/:_option/:_term/:_page', function (req, res, next) {
        passport.authenticate('jwt', function(err, user, info) {
            if (err) { return next(err); }
            else if (!user) { return  res.json({'success': false, 'msg': 'ErrorU404', data: []}); }
            else {
                var option = req.params['_option'];
                var term = req.params['_term'];
                var page = req.params['_page'];
                if(option==constraints.option_customer){
                    Customer.searchCustomerByUserPaged(user._id,page,term, function (err, formulas) {
                        if (err) {
                            console.log('Error :' + err);
                            res.json({'success': false, 'msg': 'Error Retrieving Customers with User Name : '+user.fname, data:[]});
                        }
                        else {
                            res.json({'success': true, 'msg': 'We Found what your looking for! ', data:formulas});
                        }
                    });
                }
                else {
                    res.json({'success': false, 'msg': 'Wrong Path!', data : []});

                }
            }
        })(req,res,next);
    });

module.exports = CustomerRouter;

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