var express = require('express');
var CompanyRouter = express.Router();
var Company = require('../Models/Company');

CompanyRouter.use('*',function (req, res, next) {
    console.log('Inside Company Controller!');
    next();
});

//All Routes with /
CompanyRouter
    .get('/',function (req, res) {
        Company.getAllCompanies(function (err,Companies) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Retrieving All Companies!',data:[]});}
            else{res.json({'success': true, 'msg' : 'We Found What your looking For!',data:Companies});}
        });
    })
    .post('/',function (req, res) {
        var Itm = req.body;

        Company.addCompany(Itm,function (err, Company) {
            if(err){
                console.log('Error Saving Company :'+err);
                res.json({'success': false, 'msg' : 'Error Saving Company!', data:[]});
            }
            else{
            res.json({'success': true, 'msg' : Company.Name + ' Saved Successfully', data:[]});}
        });
    });

//All Routes with /:id
CompanyRouter
    .get('/:_id',function (req, res) {
        var id = req.params['_id'];
        Company.getCompanyById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Selecting Company with Id : '+id});}
            res.json({'success': true, 'msg' : 'Found Company with Id : '+id,data:data});
        });
    })
    .delete('/:_id',function (req, res) {
        var id = req.params['_id'];
        Company.deleteCompanyById(id,function (err,data) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Deleting Company with Id : '+id,data:[]});}
            else{res.json({'success': true, 'msg' : data.Name + ' Deleted Successfully',data:[]});}

        });
    })
    .put('/:_id',function (req, res) {
        var id = req.params['_id'];
        var rec_proj = req.body;
        Company.UpdateCompany(id,rec_proj,function (err,Company) {
            if(err){console.log('Error :'+err); res.json({'success': false, 'msg' : 'Error Editing Company with Id : '+id,data:[]});}
            res.json({'success': true, 'msg' : Company.Name+ ' Updated Successfully',data:[]});
        });
    });

//Misc Routes
CompanyRouter
    .get('/check/:_term',function (req, res) {
            var name = req.params['_term'];
            if(name=="default"){
                res.json({_id:"default"});
            }else {
                Company.checkCompanyByName(name, function (err, data) {
                    if (err) {
                        console.log('Error :' + err);
                        res.json({'success': false, 'msg': 'Error Checking Company with name : ' + name,data:[]});
                    }
                    else {
                        res.json({'success': true, 'msg': 'Found category with name: ' + name,data:data});
                    }
                });
            }
    })
    .get('/u/Search/:_term',function (req, res) {
        var term = req.params['_term'];
        Company.getCompanies(term, function (err, Company) {
            if (err) {
                console.log('Error :' + err);
                res.json({'success': false, 'msg': 'Error Retriving Company!',data:[]});
            }
            else {
                res.json({'success': true, 'msg': 'Found what your looking for!',data:Company});
            }
        })
    });

module.exports = CompanyRouter;
