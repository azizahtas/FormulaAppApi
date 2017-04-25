var mongoose = require('mongoose');
var mongoosePaginated = require('mongoose-paginate');
var config = require('../config').PagingOptions;
var Schema = mongoose.Schema;
var Formula = require('../Models/Formula');

var CustomerSchema = new Schema({
    _UId : {type : String, required: true},
    Name : {type : String, required: true},
    Contact : String,
    Formulas :[{ type : Schema.Types.ObjectId, ref : 'Formula'}]
},{collection : 'Customers'});
CustomerSchema.plugin(mongoosePaginated);
CustomerSchema.virtual('FormulaCount').get(function () {
    return this.Formulas.length;
});
var Customer = module.exports = mongoose.model('Customer',CustomerSchema,'Customers');

module.exports.getAllCustomers = function(callback){
    Customer.find({},callback);
}; // Not Used

module.exports.getCustomersByUserIdPaged = function(page,Id,callback){
    Customer.paginate({_UId : Id},{page : page, limit : config.customer_limit}, function(err,customers){
        var newCust = [];
        for (var i =0; i< customers.docs.length; i++){
            var newC = new Customer(customers.docs[i]);
            var c = {
                _id : newC._id,
                Name : newC.Name,
                Count : newC.FormulaCount
            };
            newCust.push(c);
        }
        customers.docs = newCust;
        callback(err,customers);
    });

};
module.exports.getCustomerFormulasByIdPaged = function(/*page,*/UId,CId,callback){
    //var limit = config.formula_limit;
    //page = page-1;
    Customer.findOne({_UId : UId, _id : CId})
        .populate('Formulas')
        .exec (function (err, cust) {
            if(err) callback(err);
            else {
            /*var dataCount = cust.Formulas.length;
            var totalPages = dataCount / limit;
            var currentPage = page +1;

            cust.Formulas = cust.Formulas.slice(page*limit,(page*limit)+limit);

            console.log(totalPages);*/
            callback(null,cust);
            }

        });
};

module.exports.deleteUserCustomerById = function(uId,fId,callback){
    Customer.findOneAndRemove({_UId : uId,_id : fId},{},callback);
};
module.exports.UpdateUserCustomerById = function(uId,fId,newform,callback){
    Customer.findOneAndUpdate({_UId : uId,_id : fId},newform,{},callback);
};
module.exports.updateCustomerFormulas = function(uId,cId,formulas,callback){
    Customer.findOne({_UId : uId,_id : cId},{},function (err, customer) {
        if(err) callback(err)
        else {
            customer.Formulas = formulas;
            customer.save(callback);
        }
    });
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
module.exports.searchCustomerFormulas = function (UId, CId, term, callback) {
    Customer.findOne({_UId : UId, _id : CId})
        .populate('Formulas')
        .exec (function (err, cust) {
            if(err) callback(err);
            var newFormulas = [];
            for(var i=0; i<cust.Formulas.length;i++){
                var re = new RegExp(term,"g")
                if(cust.Formulas[i].Name.match(re)){
                    
                    newFormulas.push(cust.Formulas[i]);
                }
            }
            callback(null,newFormulas);
        });
};



module.exports.checkCustomerExists = function (Id,name, callback) {
    Customer.findOne({Name: name, _UId : Id},{},callback);
}; // Not Used
