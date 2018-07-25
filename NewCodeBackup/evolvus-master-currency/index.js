const debug = require("debug")("evolvus-masterCurrency:index");
const model = require("./model/masterCurrencySchema");

const collection = require("./db/masterCurrency");
const validate = require("jsonschema").validate;
const docketClient = require("evolvus-docket-client");

var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortAttributes;

var auditObject = {
  // required fields
  masterCurrency: "PLATFORM",
  source: "masterCurrency",
  name: "",
  createdBy: "",
  ipAddress: "",
  status: "SUCCESS", //by default
  eventDateTime: Date.now(),
  keyDataAsJSON: "",
  details: "",
  //non required fields
  level: ""
};

// tenantId cannot be null or undefined, InvalidArgumentError
// check if tenantId is valid from tenant table (todo)
//
// createdBy can be "System" - it cannot be validated against masterCurrencys
// ipAddress is needed for docket, must be passed
//
// object has all the attributes except tenantId, who columns
module.exports.save = (tenantId, createdBy, ipAddress, object) => {
  return collection.save(tenantId, object);
};

// tenantId should be valid
// createdBy should be requested masterCurrency, not database object masterCurrency, used for auditObject
// ipAddress should ipAddress
// filter should only have fields which are marked as filterable in the model Schema
// orderby should only have fields which are marked as sortable in the model Schema
module.exports.find = (tenantId, createdBy, ipAddress, filter, orderby, skipCount, limit) => {
  var invalidFilters = _.difference(_.keys(filter), filterables);

  return collection.find(tenantId, filter, orderby, skipCount, limit);
};