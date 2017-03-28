var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    Name : {type : String, required : true },
    Tinters : {
        Name : String,
    }
},{collection : 'Companies'});

var Company = module.exports = mongoose.model('Company',CompanySchema,'Companies');

module.exports.getAllCompanies = function(callback){
    Company.find({},callback);
};
module.exports.getCompanies = function(Term,callback){
    Company.find({ "Name" : {"$regex":Term, "$options":"i"} },{},{},callback);
};
module.exports.getCompanyById = function(Id,callback){
    Company.findById(Id,{},{},callback);
};
module.exports.deleteCompanyById = function(Id,callback){
    Company.findByIdAndRemove(Id,{},callback);
};

module.exports.addCompany = function(itm,callback){
    var newCompany = new Company(itm);
    newCompany.save(callback);
};

module.exports.UpdateCompany = function(Id,itm,callback){
    Company.findByIdAndUpdate(Id,itm,{},callback);
};

module.exports.checkCompanyByName = function (name, callback) {
  Company.findOne({Name: name},{Name :0,Size:0,Rate:0,__v:0},callback);
};

