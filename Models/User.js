// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
        who : {type : Boolean, required : true },
        fname : {type : String, required : true },
        lname : {type : String, required : true },
        phone:{type : String, required : true },
        temp_str : String
},{collection : 'Users'});
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
var User = module.exports  = mongoose.model('User', userSchema,'Users');

module.exports.addUser = function(user,callback){
    User.findOne({"local.email":user.local.email},{},function (err, usr) {
        if(usr){
            callback({error:"User Already Exists"});
        }
        else {
            var newUser = new User(user);
            newUser.local.email = user.local.email;
            newUser.local.password = newUser.generateHash(user.local.password);
            newUser.who = user.who;
            newUser.fname = user.fname;
            newUser.lname = user.lname;
            newUser.phone = user.phone;
            newUser.save(callback);
        }
    });
};

module.exports.login = function(user,callback){
    User.findOne({"local.email":user.email},{},function (err, usr) {
        if(err){
            err.msg = 'Authentication Failed! Email does not exist!';
            console.log("Duhh2");
            callback(err,false,null);
        }
        if(usr){

            if(usr.validPassword(user.password)){
                console.log("Duhh3");
                callback(null,true,usr);
            }
            else {
                console.log("Duhh4");
                callback(null,false,null);
            }
        }
        else if(!usr) {
            callback({msg:'Authentication Failed! User does not exist!'},false,null);
        }
    });
};
module.exports.resetPassword = function(user,callback){
    var newUser = new User(user);
    newUser.save(callback);
};
module.exports.userExists = function(user,callback){
    User.findOne({"_id":user._id},{},callback);
};
module.exports.userExistsEmail = function(email,callback){
    User.findOne({"local.email":email},{},callback);
};
module.exports.updateUser = function(user,callback){
    var newUser = new User(user);
    newUser.save(callback);
};
