const debug = require("debug")("evolvus-menu.test.index");
const chai = require("chai");
const mongoose = require("mongoose");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204:27017/TestPlatform_Dev";
/*
 ** chaiAsPromised is needed to test promises
 ** it adds the "eventually" property
 **
 ** chai and others do not support async / await
 */
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;
chai.use(chaiAsPromised);

const entity = require("../index");
const db = require("../db/entity");
const tenantOne = "IVL";
const tenantTwo = "KOT";
describe('menu model validation', () => {
  let entityObject = {
    "tenantId": "IVL",
    "entityCode": "entity1",
    "name": "headOffice",
    "parent": "headOffice",
    "description": "bc1 description",
    "createdBy": "SYSTEM",
    "createdDate": new Date().toISOString(),
    "lastUpdatedDate": new Date().toISOString(),
    "accessLevel": "1",
    "enableFlag": "1",
    "entityId": "abc12"
  };

  let invalidObject = {
    //add invalid menu Object here
    "tenantId": "IVL",
    "parent": "headOffice",
    "description": "northZone description",
    "createdBy": "SYSTEM",
    "createdDate": new Date().toISOString(),
    "lastUpdatedDate": new Date().toISOString(),
    "accessLevel": "2",
    "entityId": "abc12ghi56"
  };

  let undefinedObject; // object that is not defined
  let nullObject = null; // object that is null

  // before we start the tests, connect to the database
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("validation against jsonschema", () => {
    it("valid menu should validate successfully", (done) => {
      try {
        var res = entity.validate(tenantOne, entityObject);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid entity object should not throw exception: ${e}`);
      }
    });

    it("invalid menu should return errors", (done) => {
      try {
        var res = entity.validate(invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    if ("should error out for undefined objects", (done) => {
        try {
          var res = entity.validate(undefinedObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

    if ("should error out for null objects", (done) => {
        try {
          var res = entity.validate(nullObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

  });
});