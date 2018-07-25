const debug = require("debug")("evolvus-application.test.db.application");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const application = require("../../db/application");
const applicationTestData = require("./applicationTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/application.js
describe("db application testing", () => {

  const tenantOne = "IVL";
  const tenantTwo = "KOT";

  /*
   ** Before doing any tests, first get the connection.
   */
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("testing application.save", () => {
    // Testing save
    // 1. Valid application should be saved.
    // 2. Non application object should not be saved.
    // 3. Should not save same application twice.
    beforeEach((done) => {
      application.deleteAll(tenantOne)
        .then((data) => {
          return application.deleteAll(tenantTwo);
        })
        .then((data) => {
          done();
        });
    });

    it("should fail saving invalid object to database", (done) => {
      // try to save an invalid object
      const invalidObject1 = applicationTestData.invalidObject1;
      let res = application.save(tenantOne, invalidObject1);
      expect(res)
        .to.be.eventually.rejectedWith("application validation failed")
        .notify(done);
    });

    it("should fail saving duplicate object to database", (done) => {
      // save a valid object, then try to save another
      const validObject1 = applicationTestData.validObject1;
      application.save(tenantOne, validObject1)
        .then((success) => {
          let res = application.save(tenantOne, validObject1);
          expect(res)
            .to.be.eventually.rejectedWith("duplicate")
            .notify(done);
        });
    });

    it("should save valid application to database", (done) => {
      const validObject1 = applicationTestData.validObject1;
      let res = application.save(tenantOne, validObject1);
      expect(res)
        .to.eventually.have.property("_id")
        .notify(done);
    });

    it("should save multple valid application(s) to database", (done) => {
      const validObject1 = applicationTestData.validObject1;
      const validObject2 = applicationTestData.validObject2;

      application.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return application.save(tenantOne, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

    it("should save valid application(s) for multiple tenants to database", (done) => {
      const validObject1 = applicationTestData.validObject1;
      const validObject2 = applicationTestData.validObject2;

      application.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return application.save(tenantTwo, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

  }); // testing save

  describe("testing application.find", () => {
    // Testing save
    // 1. Valid application should be saved.
    // 2. Non application object should not be saved.
    // 3. Should not save same application twice.
    beforeEach((done) => {
      application.deleteAll(tenantOne)
        .then((value) => {
          return application.deleteAll(tenantTwo);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject1);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject2);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject3);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject4);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject5);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject6);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject7);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject8);
        })
        .then((value) => {
          return application.save(tenantTwo, applicationTestData.validObject1);
        })
        .then((value) => {
          return application.save(tenantTwo, applicationTestData.validObject2);
        })
        .then((value) => {
          return application.save(tenantTwo, applicationTestData.validObject3);
        })
        .then((value) => {
          return application.save(tenantTwo, applicationTestData.validObject4);
        })
        .then((value) => {
          return application.save(tenantTwo, applicationTestData.validObject5);
        })
        .then((value) => {
          return application.save(tenantTwo, applicationTestData.validObject6);
        })
        .then((value) => {
          return application.save(tenantTwo, applicationTestData.validObject7);
        })
        .then((value) => {
          return application.save(tenantTwo, applicationTestData.validObject8);
        })
        .then((value) => {
          done();
        });
    });

    it("should return all the values of a tenant", (done) => {
      let res = application.find(tenantOne, {}, {}, 0, 0);

      expect(res)
        .to.eventually.have.lengthOf(8)
        .notify(done);
    });

    it("should return a single value of a tenant", (done) => {
      let res = application.find(tenantOne, {}, {}, 0, 1);

      expect(res)
        .to.eventually.have.lengthOf(1)
        .notify(done);
    });

    it("should return a Platform object", (done) => {
      let res = application.find(tenantOne, {
        "applicationCode": "PLF"
      }, {}, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result:" + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("applicationCode")
            .to.equal("PLF");
          done();
        });
    });

    it("should return ASBA, the first application when sorted by applicationCode", (done) => {
      let res = application.find(tenantOne, {}, {
        "applicationCode": 1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("applicationCode")
            .to.equal("ASBA");
          done();
        });
    });

    it("should return Platform, the last application when sorted by applicationCode", (done) => {
      let res = application.find(tenantOne, {}, {
        "applicationCode": -1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("applicationCode")
            .to.equal("PLF");
          done();
        });
    });

    it("should return 6 enabled applications", (done) => {
      let res = application.find(tenantOne, {
        "enableFlag": "1"
      }, {
        "applicationCode": -1
      }, 0, 10);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app)
            .to.have.lengthOf(6);
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("applicationCode")
            .to.equal("PLF");
          expect(app[5])
            .to.have.property("applicationCode")
            .to.equal('ASBA');
          done();
        });
    });

  }); // findAll testing

  describe("update testing", () => {
    beforeEach((done) => {
      application.deleteAll(tenantOne)
        .then((value) => {
          return application.deleteAll(tenantTwo);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject1);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject2);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject3);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject4);
        })
        .then((value) => {
          done();
        });
    });

    it("should disable Platform application", (done) => {
      let res = application.update(tenantOne, "PLF", {
        "enableFlag": "0",
        "updatedDate": new Date()
          .toISOString(),
        "description": "Updated the application at: " + Date.now()
      });
      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app)
            .to.have.property("nModified")
            .to.equal(1);
          done();
        });
    });
  });

  describe("testing application.counts", () => {
    //  Delete all records, insert two record
    //  1. Query by one attribute and it should return all roles having attribute value
    //2. Query by an arbitrary attribute value and it should return {}

    //delete all records and insert two roles
    beforeEach((done) => {
      application.deleteAll(tenantOne)
        .then((value) => {
          return application.deleteAll(tenantTwo);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject1);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject2);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject3);
        })
        .then((value) => {
          return application.save(tenantOne, applicationTestData.validObject4);
        })
        .then((value) => {
          done();
        });
    });

    it("should return Count for valid attribute value", (done) => {
      // take one valid attribute and its value
      let res = application.counts(tenantOne, "abc12", "1", {
        "applicationCode": "DOCKET",
      });
      expect(res)
        .to.eventually.deep.equal(1)
        .notify(done);

    });

  });


}); // db application testing