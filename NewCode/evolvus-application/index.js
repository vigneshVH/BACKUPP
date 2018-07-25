const debug = require("debug")("evolvus-application:index");
const model = require("./model/applicationSchema");
const db = require("./db/applicationSchema");
const _ = require('lodash');
const collection = require("./db/application");
const validate = require("jsonschema")
  .validate;
const docketClient = require("evolvus-docket-client");

var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;

var docketObject = {
  // required fields
  application: "PLATFORM",
  source: "application",
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
module.exports = {
  model,
  db,
  filterAttributes,
  sortAttributes
};

module.exports.validate = (tenantId, applicationObject) => {
  return new Promise((resolve, reject) => {
    if (typeof applicationObject === "undefined") {
      throw new Error("IllegalArgumentException:menuObject is undefined");
    }
    var res = validate(applicationObject, schema);
    debug("validation status: ", JSON.stringify(res));
    if (res.valid) {
      resolve(res.valid);
    } else {
      reject(res.errors);
    }
  });
};

module.exports.save = (tenantId, ipAddress, createdBy, applicationObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof applicationObject === 'undefined' || applicationObject == null) {
        throw new Error("IllegalArgumentException: applicationObject is null or undefined");
      }
      console.log(applicationObject, "inside save");
      var res = validate(applicationObject, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        if (res.errors[0].name == "required") {
          reject(`${res.errors[0].argument} is required`);
        } else {
          reject(res.errors[0].schema.message);
        }
      } else {
        // if the object is valid, save the object to the database
        console.log("inside else");
        docketObject.name = "application_save";
        docketObject.keyDataAsJSON = JSON.stringify(applicationObject);
        docketObject.details = `application creation initiated`;
        docketClient.postToDocket(docketObject);
        collection.save(tenantId, applicationObject).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
          console.log(result, "result");
        }).catch((e) => {
          debug(`failed to save with an error: ${e}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      docketObject.name = "application_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(applicationObject);
      docketObject.details = `caught Exception on application_save ${e.message}`;
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
        debug(`application(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`failed to find all the menu(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
};



module.exports.update = (tenantId, code, update) => {
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null || code == null || update == null) {
        throw new Error("IllegalArgumentException:tenantId/code/update is null or undefined");
      }
      collection.update(tenantId, code, update).then((resp) => {
        debug("updated successfully", resp);
        resolve(resp);
      }).catch((error) => {
        debug(`failed to update ${error}`);
        reject(error);
      });
    } catch (e) {
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};