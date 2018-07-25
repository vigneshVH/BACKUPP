const debug = require("debug")("evolvus-menu:index");
const model = require("./model/menuSchema");
const db = require("./db/menuSchema");
const _ = require("lodash");

const collection = require("./db/menu");
const validate = require("jsonschema").validate;
const docketClient = require("@evolvus/evolvus-docket-client");

var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;

var docketObject = {
  // required fields
  menu: "PLATFORM",
  source: "menu",
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

module.exports.validate = (tenantId, menuObject) => {
  return new Promise((resolve, reject) => {
    if (typeof menuObject === "undefined") {
      throw new Error("IllegalArgumentException:menuObject is undefined");
    }
    var res = validate(menuObject, schema);
    debug("validation status: ", JSON.stringify(res));
    if (res.valid) {
      resolve(res.valid);
    } else {
      reject(res.errors);
    }
  });
};

module.exports.save = (tenantId, menuObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof menuObject === 'undefined' || menuObject == null) {
        throw new Error("IllegalArgumentException: menuObject is null or undefined");
      }
      var res = validate(menuObject, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      } else {
        // if the object is valid, save the object to the database

        docketObject.name = "menu_save";
        docketObject.keyDataAsJSON = JSON.stringify(menuObject);
        docketObject.details = `menu creation initiated`;
        docketClient.postToDocket(docketObject);
        collection.save(tenantId, menuObject).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          debug(`failed to save with an error: ${e}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      docketObject.name = "menu_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(menuObject);
      docketObject.details = `caught Exception on menu_save ${e.message}`;
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
        debug(`menu(s) stored in the database are ${docs}`);
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