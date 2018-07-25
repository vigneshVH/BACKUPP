const debug = require("debug")("evolvus-masterTimeZone:index");
const model = require("./model/masterTimeZoneSchema");

const collection = require("./db/masterTimeZone");
const validate = require("jsonschema").validate;
const docketClient = require("evolvus-docket-client");

var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortAttributes;

var auditObject = {
  // required fields
  masterTimeZone: "PLATFORM",
  source: "masterTimeZone",
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
// createdBy can be "System" - it cannot be validated against masterTimeZones
// ipAddress is needed for docket, must be passed
//
// object has all the attributes except tenantId, who columns
module.exports.save = (tenantId, createdBy, ipAddress, object) => {
  return collection.save(tenantId, object);
};

// tenantId should be valid
// createdBy should be requested masterTimeZone, not database object masterTimeZone, used for auditObject
// ipAddress should ipAddress
// filter should only have fields which are marked as filterable in the model Schema
// orderby should only have fields which are marked as sortable in the model Schema
module.exports.find = (tenantId, createdBy, ipAddress, filter, orderby, skipCount, limit) => {
  var invalidFilters = _.difference(_.keys(filter), filterables);

  return collection.find(tenantId, filter, orderby, skipCount, limit);
};