const debug = require("debug")("evolvus-health-check.test.db.nodehealthCheck");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const healthCheck = require("../../db/healthCheck");
const healthCheckTestData = require("./healthCheckTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/contact.js
describe("db healthCheck testing", () => {

  /*   ** Before doing any tests, first get the connection.
   */
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("testing healthCheck.save", () => {
    //Testing save
    // 1. Valid contact should be saved.
    // 2. Non contact object should not be saved.
    // 3. Should not save same contact twice.
    it("should save valid contact to database", (done) => {
      const validObject1 = contactTestData.validObject1;
      let res = contact.save(tenantOne, validObject1);
      expect(res)
        .to.eventually.have.property("_id")
        .notify(done);
    });
  });

  describe("testing application.findAll by limit", () => {
    // 1. Delete all records in the table and insert
    //    4 new records.
    // find -should return an array of size equal to value of limit with the
    // applications.
    // Caveat - the order of the applications fetched is indeterminate

    // delete all records and insert four applications
    beforeEach((done) => {
      application.deleteAll().then(() => {
        application.save(object1).then((res) => {
          application.save(object2).then((res) => {
            application.save(object3).then((res) => {
              done();
            });
          });
        });
      });
    });
  });

});
// db contact testing