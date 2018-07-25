const debug = require("debug")("evolvus-nodehealthCheck:db:nodehealthCheck");
const mongoose = require("mongoose");
const ObjectId = require('mongodb')
  .ObjectID;
const _ = require("lodash");

const schema = require("./healthCheckSchema");

// Creates a contactCollection collection in the database
var collection = mongoose.model("healthCheck", schema);



// Saves the collection object to the database and returns a Promise
// The assumption here is that the Object is valid
// tenantId must match object.tenantId,if missing it will get added here
module.exports.save = (object) => {
  // let result = _.merge(object
  // };
  let saveObject = new collection(object);
  return saveObject.save();
};

// Returns a limited set if all the application(s) with a Promise
// if the collectiom has no records it Returns
// a promise with a result of  empty object i.e. {}
module.exports.findAll = (limit) => {
  if (limit < 1) {
    return collection.find({});
  }
  return collection.find({}).limit(limit);
};

// Deletes all the entries of the collection.
// To be used by test only
// module.exports.deleteAll = (tenantId) => {
//   let query = {
//     "tenantId": tenantId
//   };
//   return collection.remove(query);
// };