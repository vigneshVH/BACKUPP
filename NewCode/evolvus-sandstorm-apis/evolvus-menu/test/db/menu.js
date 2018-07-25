const debug = require("debug")("evolvus-menu.test.db.menu");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const menu = require("../../db/menu");
const menuTestData = require("./menuTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204:27017/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/menu.js
describe("db menu testing", () => {

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

  describe("testing menu.save", () => {
    // Testing save
    // 1. Valid menu should be saved.
    // 2. Non menu object should not be saved.
    // 3. Should not save same menu twice.
    beforeEach((done) => {
      menu.deleteAll(tenantOne)
        .then((data) => {
          return menu.deleteAll(tenantTwo);
        })
        .then((data) => {
          done();
        });
    });

    it("should fail saving invalid object to database", (done) => {
      // try to save an invalid object
      const invalidObject1 = menuTestData.invalidObject1;
      let res = menu.save(tenantOne, invalidObject1);
      expect(res)
        .to.be.eventually.rejectedWith("menu validation failed")
        .notify(done);
    });

    // it("should fail saving duplicate object to database", (done) => {
    //   // save a valid object, then try to save another
    //   const validObject1 = menuTestData.validObject1;
    //   menu.save(tenantOne, validObject1)
    //     .then((success) => {
    //       let res = menu.save(tenantOne, validObject1);
    //       expect(res)
    //         .to.be.eventually.rejectedWith("duplicate")
    //         .notify(done);
    //     });
    // });

    it("should save valid menu to database", (done) => {
      const validObject1 = menuTestData.validObject1;
      let res = menu.save(tenantOne, validObject1);

      expect(res)
        .to.eventually.have.property("_id")
        .notify(done);
    });

    it("should save multple valid menu(s) to database", (done) => {
      const validObject1 = menuTestData.validObject1;
      const validObject2 = menuTestData.validObject2;

      menu.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return menu.save(tenantOne, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

    it("should save valid menu(s) for multiple tenants to database", (done) => {
      const validObject1 = menuTestData.validObject1;
      const validObject2 = menuTestData.validObject2;

      menu.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return menu.save(tenantTwo, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

  }); // testing save

  describe("testing menu.find", () => {
    // Testing save
    // 1. Valid menu should be saved.
    // 2. Non menu object should not be saved.
    // 3. Should not save same menu twice.
    beforeEach((done) => {
      menu.deleteAll(tenantOne)
        .then((value) => {
          return menu.deleteAll(tenantTwo);
        })
        .then((value) => {
          return menu.save(tenantOne, menuTestData.validObject1);
        })
        .then((value) => {
          return menu.save(tenantOne, menuTestData.validObject2);
        })
        .then((value) => {
          return menu.save(tenantOne, menuTestData.validObject3);
        })
        .then((value) => {
          return menu.save(tenantOne, menuTestData.validObject4);
        })
        .then((value) => {
          return menu.save(tenantOne, menuTestData.validObject5);
        })
        .then((value) => {
          return menu.save(tenantOne, menuTestData.validObject6);
        })
        .then((value) => {
          return menu.save(tenantOne, menuTestData.validObject7);
        })
        .then((value) => {
          return menu.save(tenantOne, menuTestData.validObject8);
        })
        .then((value) => {
          return menu.save(tenantTwo, menuTestData.validObject1);
        })
        .then((value) => {
          return menu.save(tenantTwo, menuTestData.validObject2);
        })
        .then((value) => {
          return menu.save(tenantTwo, menuTestData.validObject3);
        })
        .then((value) => {
          return menu.save(tenantTwo, menuTestData.validObject4);
        })
        .then((value) => {
          return menu.save(tenantTwo, menuTestData.validObject5);
        })
        .then((value) => {
          return menu.save(tenantTwo, menuTestData.validObject6);
        })
        .then((value) => {
          return menu.save(tenantTwo, menuTestData.validObject7);
        })
        .then((value) => {
          return menu.save(tenantTwo, menuTestData.validObject8);
        })
        .then((value) => {
          done();
        });
    });

    it("should return all the values of a tenant", (done) => {

      let res = menu.find(tenantOne, {}, {}, 0, 0);

      expect(res)
        .to.eventually.have.lengthOf(8)
        .notify(done);
    });

    it("should return a single value of a tenant", (done) => {
      let res = menu.find(tenantOne, {}, {}, 0, 1);

      expect(res)
        .to.eventually.have.lengthOf(1)
        .notify(done);
    });

    it("should return a menus for application code ", (done) => {
      let res = menu.find(tenantOne, {
        "applicationCode": "FLUX-CDA"
      }, {}, 0, 10);

      expect(res)
        .to.eventually.have.lengthOf(4)
        .notify(done);
    });

    it("should return Audit, the first menu when sorted by menuGroupOrder", (done) => {
      let res = menu.find(tenantOne, {}, {
        "menuGroupOrder": 1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("menuGroupCode")
            .to.equal("Audit");
          done();
        });
    });
    it("should return menus sorted by menuGroupOrder", (done) => {
      let res = menu.find(tenantOne, {}, {
        "menuGroupOrder": -1
      }, 0, 10);
      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("menuGroupCode")
            .to.equal("AuditSeven");
          done();
        });
    });

    it("should return AuditTwo, the last menu when sorted by menuGroupCode", (done) => {
      let res = menu.find(tenantOne, {}, {
        "menuGroupCode": -1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("menuGroupCode")
            .to.equal("AuditTwo");
          done();
        });
    });
  });
});