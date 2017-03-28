var mongoose = require('mongoose');
var mongoosePaginated = require('mongoose-paginate');
var config = require('../config').PagingOptions;
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    _UId : {type : String, required: true},
    Name : {type : String, required: true},
    Contact : String,
    Formulas :[
        {
          Name : String,
          _FId : String
        }
    ]
},{collection : 'Customers'});
CustomerSchema.plugin(mongoosePaginated);

var Customer = module.exports = mongoose.model('Customer',CustomerSchema,'Customers');

module.exports.getAllCustomers = function(callback){
    Customer.find({},callback);
}; // Not Used

module.exports.getCustomersByUserIdPaged = function(page,Id,callback){
    Customer.paginate({_UId : Id},{page : page, limit : config.customer_limit}, function(err,customers){
        console.log(customers);
        callback(err,customers);
    });

};
module.exports.deleteUserCustomerById = function(uId,fId,callback){
    Customer.findOneAndRemove({_UId : uId,_id : fId},{},callback);
};
module.exports.UpdateUserCustomerById = function(uId,fId,newform,callback){
    Customer.findOneAndUpdate({_UId : uId,_id : fId},newform,{},callback);
};

module.exports.getUserCustomerById = function(uId,fId,callback){
    Customer.find({_UId : uId,_id : fId},{},callback)
};
module.exports.getCustomerById = function(Id,callback){
    Customer.findById(Id,{},{},callback);
}; // Not Used

module.exports.addCustomer = function(itm,callback){
    var newCustomer = new Customer(itm);
    newCustomer.save(callback);
};
module.exports.searchCustomerByUserPaged = function (uId, page, term, callback) {
    //db.collection.find({name:{'$regex' : '^string$', '$options' : 'i'}})
    //Customer.paginate({Name :new RegExp('/^'+term+'/$',"i") /*/Cos/i*/},{page : page, limit : config.customer_limit}, function(err,customers){
    Customer.paginate({"Name" : {"$regex":term, "$options" : "i"}},{page : page, limit : config.customer_limit}, function(err,customers){
        callback(err,customers);
    });
};
module.exports.checkCustomerExists = function (Id,name, callback) {
    Customer.findOne({Name: name, _UId : Id},{},callback);
}; // Not Used

