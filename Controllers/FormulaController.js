var express = require('express');
var FormulaRouter = express.Router();
var Formula = require('../Models/Formula');
var passport =require('passport');
var jwt =require('jwt-simple');
var config = require('../config');
var constraints = config.Constants;
var User = require('../Models/User');

FormulaRouter.use('*',function (req, res, next) {
    console.log('Inside Formula Controller!');
    next();
});

//All Routes with /
FormulaRouter
    .get('/page/:_page',function (req, res, next) {
        passport.authenticate('jwt', function(err, user, info) {
            if (err) { return next(err); }
            else if (!user) { return  res.json({'success': false, 'msg': 'ErrorU404', data: []}); }
            else{
                var page = req.params['_page'];
                Formula.getFormulasByUserIdPaged(page,user._id,function (err,Formulas) {
                    if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Retrieving Formulas for User : '+user.fname+' '+user.lname , data:[]});}
                    else{res.json({'success': true, 'msg' : 'We Found What you were looking for!', data:Formulas});}
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
                        var formula = req.body;
                        formula._UName = user.fname + " " + user.lname;
                        formula._UId = user._id;
                        if(formula.Date == "")formula.Date = new Date();
                        else formula.Date +=  " 00:00:00.000Z";
                        if(formula.Type == "Custom") formula.Type = "C";
                        else if(formula.Type == "Standard") formula.Type = "S";
                        Formula.addFormula(formula, function (err, formula) {
                            if (err) {
                                console.log('Error Saving Formula :' + err);
                                res.json({'success': false, 'msg': 'Error Saving Formula!', data:[]});
                            }
                            else {
                                res.json({'success': true, 'msg': 'Formula Saved Successfully', data:[]});
                            }
                        });
                }
            }
        })(req,res,next);
    });
//All Routes with /Id/:id
FormulaRouter
    .get('/Id/:_id',function (req, res, next) {
        passport.authenticate('jwt', function(err, user, info) {
            if (err) { return next(err); }
            else if (!user) { return  res.json({'success': false, 'msg': 'ErrorU404', data: []}); }
            else {
        var token = this.getToken(req.headers);
        if (token) {
                var fid = req.params['_id'];
                Formula.getUserFormulaById(user._id,fid,function (err,data) {
                    if(err){console.log('Error :'+err); res.json({'success': false, 'msg': 'Sorry We Could not get the Formula with the Id!', data: []});}
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
                Formula.deleteUserFormulaById(user._id,fid,function (err,data) {
                    if(err){console.log('Error :'+err); res.json({'success': false, 'msg': 'We Couldnt Delete Formula With Id!', data: []});}
                    else{res.json({'success': true, 'msg': 'Formula With Name '+data.Name+' Deleted Successfully!', data: []});}
                });
                }
            }
        })(req,res,next);
    })
    .put('/Id/:_id',function (req, res,next) {
        passport.authenticate('jwt', function(err, user, info) {
            if (err) { return next(err); }
            else if (!user) { return  res.json({'success': false, 'msg': 'ErrorU404', data: []}); }
            else {
                    var fid = req.params['_id'];
                    var formula = req.body;
                    if(formula.Date == "") formula.Date = new Date();
                    else formula.Date +=  " 00:00:00.000Z";
                console.log(formula.Date);
                    if(formula.Type == "Custom") formula.Type = "C";
                     else if(formula.Type == "Standard") formula.Type = "S";

                    Formula.UpdateUserFormulaById(user._id,fid, formula, function (err, Formula) {
                        if (err) {
                            console.log('Error :' + err);
                            res.json({'success': false, 'msg': 'We Couldnt Edit Formula With Id!', data: []});
                        }
                        res.json({'success': true, 'msg': 'Formula Updated Successfully!', data: []});
                    });
                }
        })(req,res,next);
    });

//Misc Routes
// Routs With /u/Term
FormulaRouter
    .get('/u/:_term',function (req, res) {
            var name = req.params['_term'];
            if(name == "Duhh"){
                console.log("Yeppieeee");
                res.json({'success': true, 'msg': 'Lalala!', data : [
                    {
                        "Name" : "Aziz",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    },{
                        "Name" : "Prakash Kore",
                        "Formulas" : [
                            {
                                "Name" : "Moon Bean Silver",
                                "_FId" : "78676767678"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            },
                            {
                                "Name" : "Moon Cream",
                                "_FId" : "411313a1d"
                            }
                        ]
                    }
                ]})
            }
            else {
                res.json({'success': false, 'msg': 'Wrong Path!', data : []});
                console.log("Yeppieeee22");
            }
    });
//Routes With /search/Option/term
FormulaRouter
    .get('/search/:_option/:_term/:_page', function (req, res, next) {
        passport.authenticate('jwt', function(err, user, info) {
            if (err) { return next(err); }
            else if (!user) { return  res.json({'success': false, 'msg': 'ErrorU404', data: []}); }
            else {
                var option = req.params['_option'];
                var term = req.params['_term'];
                var page = req.params['_page'];
                if(option==constraints.option_formula_personal){
                    Formula.searchFormulaByUserPaged(user._id,page,term, function (err, formulas) {
                        if (err) {
                            console.log('Error :' + err);
                            res.json({'success': false, 'msg': 'Error Retrieving Formulas with User Name : '+user.fname, data:[]});
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



module.exports = FormulaRouter;