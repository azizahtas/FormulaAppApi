module.exports = {
	"port" : 5555,
	"client" : 3000,
	"db" : "FormulaDb",
	"db_host" : "localhost",
	"db_port" : 27017,
	"secret": "AzizAhtasIsAPro"
};

module.exports.PagingOptions = {
	default_limit : 3,
    customer_limit : 20,
    formula_limit : 10
};

module.exports.Constants = {
	option_formula_personal : "PERSONAL_FORMULA",
	option_formula_community : "COMMUNITY_FORMULA",
	option_customer : "CUSTOMER"

}