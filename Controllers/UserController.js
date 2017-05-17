var express = require('express');
var UserRouter = express.Router();
var User = require('../Models/User');
var jwt = require('jwt-simple');
var config = require("../config");
var nodemailer = require('nodemailer');
var rand = require('csprng');

var smtpTransport = nodemailer.createTransport({
    service : 'gmail',
   auth : {
       user : "azizahtas@gmail.com",
       pass : "***"
   }
});

UserRouter.use('*',function (req, res, next) {
    console.log('Inside User Controller!');
    next();
});

UserRouter
    .get('/checkUser/:_email',function (req, res) {
        var email = req.params['_email'];
        User.userExistsEmail(email,function (err,usr) {
            if(err){
                res.json({success: false, msg: 'Something Went Wrong', data:[]});
            }
            else{
                if(usr){
                    res.json({success: true, msg: 'User Exists', data:[]});
                }
                else{
                    res.json({success: false, msg: 'User Does not Exist', data:[]});
                }
            }
        })
    })
    .post('/signup', function(req, res) {
    if (!req.body.local.email || !req.body.local.password) {
        res.json({success: false, msg: 'Please pass email and password.', data:[]});
    } else {
        var user = req.body;
        User.addUser(user,function (err,usr) {
            if (err) {
                res.json({success: false, msg: 'Username already exists.',data:[]});
            }
            else{
                var newUser = {
                    email : user.email,
                    who : usr.who,
                    _id : usr._id,
                    fname : usr.fname,
                    lname : usr.lname
                };
                var token = jwt.encode(newUser, config.Secret.secret);
                res.json({success: true, msg : "Successfully Logged In!", data: token});
            }
        });
    }
})
    .post('/login', function(req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass email and password.',data:[]});
    } else {
        var user = req.body;

        User.login(user,function (err,isMatch,usr) {
            if(err){
                res.json({success: false, msg: err.msg,data:[]});
            }
            else if(!err && isMatch && usr){
                var newUser = {
                    email : user.email,
                    who : usr.who,
                    _id : usr._id,
                    fname : usr.fname,
                    lname : usr.lname
                };
                var token = jwt.encode(newUser, config.Secret.secret);
                res.json({success: true, msg : "Successfully Logged In!", data: [token]});
            }
            else if(!err && !isMatch && !usr){
                res.json({success: false, msg: "Sorry Your password Does not match!",data:[]});
            }
            else {
                res.json({success: false, msg: "Something went wrong!",data:[]});
            }
        });
    }
})
    .post('/forgotPassword', function(req, res) {
    var temp = rand(24,24);
    if (!req.body.email) {
        res.json({success: false, msg: 'Please enter email Id.',data:[]});
    } else {
        var email = req.body.email;
        User.userExistsEmail(email,function (err,usr) {
            if(err){
                console.log("Error While resetting password!");
                console.log(err);
                res.json({success: false, msg: "Something went wrong!",data:[]});
            }
            else if(usr){
                usr.temp_str = temp;
                User.updateUser(usr,function (err, usr) {
                    if(err){}
                    else{
                        var mailOptions = {
                            from: "Aziz Ahtas <azizahtas@gmail.com>",
                            to: email,
                            subject: "Reset Password ",
                            text: "Hello "+email+".  Code to reset your Password is "+temp+".nnRegards,nAziz Ahtas,nFormulizer Team."
                        };
                        smtpTransport.sendMail(mailOptions,function (err,response) {
                            if(err){
                                res.json({success: false, msg : "Error While Sending Mail!", data: []});
                            }
                            else{
                                res.json({success: true, msg : "Check your Email and enter the verification code to reset your Password", data: []});
                            }
                        });
                    }
                });
            }
            else if(!usr){
                res.json({success: false, msg: "Sorry the email dose not exist!",data:[]});
            }
            else {
                res.json({success: false, msg: "Something went wrong!",data:[]});
            }
        });
    }
})
    .post('/resetPassword', function(req, res) {
    if (!req.body.email) {
        res.json({success: false, msg: 'Please enter email Id.',data:[]});
    } else {
        var email = req.body.email;
        var key = req.body.key;
        var newPass = req.body.newPass;
        User.userExistsEmail(email,function (err,usr) {
            if(err){
                console.log("Error While resetting password!");
                console.log(err);
                res.json({success: false, msg: "Something went wrong!",data:[]});
            }
            else if(usr){
                if(key == usr.temp_str){
                    usr.local.password = newPass;
                    User.resetPassword(usr,function (err, user) {
                        if(err){
                            console.log("Error ResetPassword in User Controller");
                            console.log(err);
                            res.json({success: false, msg : "Error While Resetting Password, Please Try Again!", data: []});
                        }
                        else{
                            res.json({success: true, msg : "Password reset Successful!", data: []});
                        }
                    })
                }
            }
            else if(!usr){
                res.json({success: false, msg: "Sorry the email dose not exist!",data:[]});
            }
            else {
                res.json({success: false, msg: "Something went wrong! Please try Again!",data:[]});
            }
        });
    }
})
;
module.exports = UserRouter;
