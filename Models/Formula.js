var mongoose = require('mongoose');
var mongoosePaginated = require('mongoose-paginate');
var config = require('../config').PagingOptions;
var Schema = mongoose.Schema;

var FormulaSchema = new Schema({
    _UId : {type : String, required: true},
    _UName : {type : String, required: true},
    Type : {type : String, required: true}, //S - Standard , C - Custom
    Name : {type : String, required: true},
    Base : {type : String, required: true}, // PU, NC, Epoxy, FastSet, Enamel, Water
    Access : {type : String, required: true},// Public , Private
    Company : {type : String, required: true}, // Company
    Date : {type : Date, required: true},
    Likes : Number,
    Rating : Number,
    Desc : String,
    Formula :[
        {
          Tinter : {type : String, required: true},
          Qty : {type : Number, required: true}
        }
    ],
    TWeight : {type : Number, required: true},
    VCompany : String,
    VModal : String

},{collection : 'Formulas'});
FormulaSchema.plugin(mongoosePaginated);

var Formula = module.exports = mongoose.model('Formula',FormulaSchema,'Formulas');
module.exports.modal = Formula;
module.exports.getAllFormulas = function(callback){
    Formula.find({},callback);
}; // Not Used

module.exports.getFormulasByUserIdPaged = function(page,Id,callback){
    Formula.paginate({_UId : Id},{page : page, limit : config.formula_limit}, function(err,formulas){
        console.log(formulas);
        callback(err,formulas);
    });

};
module.exports.deleteUserFormulaById = function(uId,fId,callback){
    Formula.findOneAndRemove({_UId : uId,_id : fId},{},callback);
};
module.exports.UpdateUserFormulaById = function(uId,fId,newform,callback){
    Formula.findOneAndUpdate({_UId : uId,_id : fId},newform,{},callback);
};

module.exports.getUserFormulaById = function(uId,fId,callback){
    Formula.find({_UId : uId,_id : fId},{},callback)
};
module.exports.getFormulaById = function(Id,callback){
    Formula.findById(Id,{},{},callback);
}; // Not Used

module.exports.addFormula = function(itm,callback){
    var newFormula = new Formula(itm);
    newFormula.save(callback);
};
module.exports.searchFormulaByUserPaged = function (uId, page, term, callback) {
    //db.collection.find({name:{'$regex' : '^string$', '$options' : 'i'}})
    //Formula.paginate({Name :new RegExp('/^'+term+'/$',"i") /*/Cos/i*/},{page : page, limit : config.formula_limit}, function(err,formulas){
    Formula.paginate({"Name" : {"$regex":term, "$options" : "i"}},{page : page, limit : config.formula_limit}, function(err,formulas){
        callback(err,formulas);
    });
};
module.exports.checkFormulaExists = function (Id,name, callback) {
  Formula.findOne({Name: name, _UId : Id},{},callback);
}; // Not Used
