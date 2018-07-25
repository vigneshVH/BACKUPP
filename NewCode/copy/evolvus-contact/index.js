const debug = require("debug")("evolvus-contact:index");
const model = require("./model/contactSchema");
const db = require("./db/contactSchema");
const _ = require("lodash");
const collection = require("./db/contact");
const validate = require("jsonschema").validate;
const docketClient = require("evolvus-docket-client");


var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;

var auditObject = {
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


module.exports.validate = (tenantId, contactObject) => {
  return new Promise((resolve, reject) => {
    if (typeof contactObject === "undefined") {
      throw new Error("IllegalArgumentException:contactObject is undefined");
    }
    var res = validate(contactObject, schema);
    debug("validation status: ", JSON.stringify(res));
    if (res.valid) {
      resolve(res.valid);
    } else {
      reject(res.errors);
    }
  });
};

module.exports.save = (tenantId, contactObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof contactObject === 'undefined' || contactObject == null) {
        throw new Error("IllegalArgumentException: contactObject is null or undefined");
      }
      var res = validate(contactObject, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      } else {
        // if the object is valid, save the object to the database

        docketObject.name = "contact_save";
        docketObject.keyDataAsJSON = JSON.stringify(contactObject);
        docketObject.details = `contact creation initiated`;
        docketClient.postToDocket(docketObject);
        collection.save(tenantId, contactObject).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          debug(`failed to save with an error: ${e}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      docketObject.name = "contact_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(contactObject);
      docketObject.details = `caught Exception on contact_save ${e.message}`;
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
  console.log("inisde index");
  return new Promise((resolve, reject) => {
    try {
      var invalidFilters = _.difference(_.keys(filter), filterAttributes);
      collection.find(tenantId, filter, orderby, skipCount, limit).then((docs) => {
        console.log(docs, "docs");
        debug(`contact(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        console.log("inside0", e);
        debug(`failed to find all the contact(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports.counts = (tenantId, countQuery) => {
  return new Promise((resolve, reject) => {
    try {
      collection.counts(tenantId, countQuery).then((contactCount) => {
        console.log(contactCount);
        if (contactCount > 0) {
          debug(`contactCount Data is ${contactCount}`);
          resolve(contactCount);
        } else {
          debug(`No contact count data available for filter query ${contactCount}`);
          resolve(0);
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      debug(`caught exception ${e}`);
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