const Validator = require('jsonschema').Validator;
var validator = new Validator();
const schemaData = require('fs').readFileSync('Json-Schema.json');
const jsonSchema = JSON.parse(schemaData);
let schemaCheck = {}

schemaCheck.validator = function(req){
    if(validator.validate(req, jsonSchema).errors.length<1){
        return true;
    }
    else{
        return false;
    }
}

schemaCheck.hash = require('object-hash');

module.exports = schemaCheck;