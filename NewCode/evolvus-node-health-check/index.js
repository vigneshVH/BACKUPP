const debug = require("debug")("evolvus-node-health-check:index");
const model = require("./model/healthCheckSchema");
const db = require("./db/healthCheckSchema");
const _ = require("lodash");
const collection = require("./db/healthCheck");
const validate = require("jsonschema").validate;
const docketClient = require("evolvus-docket-client");


var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortAttributes;

var docketObject = {
  // required fields
  contact: "PLATFORM",
  source: "contact",
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




module.exports.save = (healthCheckObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof healthCheckObject === 'undefined' || healthCheckObject == null) {
        throw new Error("IllegalArgumentException: healthCheckObject is null or undefined");
      }
      var res = validate(healthCheckObject, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        if (res.errors[0].name == "required") {
          reject(`${res.errors[0].argument} is required`);
        } else {
          reject(res.errors[0].schema.message);
        }
      } else {
        // if the object is valid, save the object to the database

        docketObject.name = "healthCheck_save";
        docketObject.keyDataAsJSON = JSON.stringify(healthCheckObject);
        docketObject.details = `healthCheck creation initiated`;
        docketClient.postToDocket(docketObject);
        collection.save(healthCheckObject).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          debug(`failed to save with an error: ${e}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      docketObject.name = "healthCheck_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(healthCheckObject);
      docketObject.details = `caught Exception on application_save ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};



// List all the objects in the database
// makes sense to return on a limited number
// (what if there are 1000000 records in the collection)
module.exports.getAll = (limit) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof(limit) == "undefined" || limit == null) {
        throw new Error("IllegalArgumentException: limit is null or undefined");
      }
      docketObject.name = "healthCheck_getAll";
      docketObject.keyDataAsJSON = `getAll with limit ${limit}`;
      docketObject.details = `healthCheck getAll method`;
      docketClient.postToDocket(docketObject);

      collection.findAll(limit).then((docs) => {
        debug(`healthCheck(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`failed to find all the application(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      docketObject.name = "healthCheck_ExceptionOngetAll";
      docketObject.keyDataAsJSON = "healthCheckObject";
      docketObject.details = `caught Exception on healthCheck_getAll ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};