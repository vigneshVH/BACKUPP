const debug = require("debug")("evolvus-masterTimeZone:index");
const model = require("./model/masterTimeZoneSchema");
const db = require("./db/masterTimeZoneSchema");
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


module.exports.masterTimeZone = {
  model,
  db,
  filterAttributes,
  sortAttributes
};


module.exports.validate = (tenantId, masterTimeZoneObject) => {
  return new Promise((resolve, reject) => {
    if (typeof masterTimeZoneObject === "undefined") {
      throw new Error("IllegalArgumentException:masterTimeZoneObject is undefined");
    }
    var res = validate(masterTimeZoneObject, schema);
    debug("validation status: ", JSON.stringify(res));
    if (res.valid) {
      resolve(res.valid);
    } else {
      reject(res.errors);
    }
  });
};

module.exports.save = (tenantId, masterTimeZoneObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof masterTimeZoneObject === 'undefined' || masterTimeZoneObject == null) {
        throw new Error("IllegalArgumentException: masterTimeZoneObject is null or undefined");
      }
      var res = validate(masterTimeZoneObject, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      } else {
        // if the object is valid, save the object to the database

        docketObject.name = "masterTimeZone_save";
        docketObject.keyDataAsJSON = JSON.stringify(masterTimeZoneObject);
        docketObject.details = `masterTimeZone creation initiated`;
        docketClient.postToDocket(docketObject);
        collection.save(tenantId, masterTimeZoneObject).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          debug(`failed to save with an error: ${e}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      docketObject.name = "masterTimeZone_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(masterTimeZoneObject);
      docketObject.details = `caught Exception on masterTimeZone_save ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};


// tenantId should be valid
// createdBy should be requested user, not database object user, used for auditObject
// ipAddress should ipAddress
// filter should only have fields which are marked as filterable in the model Schema
// orderby should only have fields which are marked as sortable in the model Schema
module.exports.find = (tenantId, filter, orderby, skipCount, limit) => {
  return new Promise((resolve, reject) => {
    try {
      var invalidFilters = _.difference(_.keys(filter), filterAttributes);
      collection.find(tenantId, filter, orderby, skipCount, limit).then((docs) => {
        debug(`masterTimeZone(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`failed to find all the masterTimeZone(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
};