const debug = require("debug")("evolvus-platform-server:routes:api:contact");
const _ = require("lodash");
const contact = require("./../../index");

const LIMIT = process.env.LIMIT || 10;
const tenantHeader = "X-TENANT-ID";
const userHeader = "X-USER";
const ipHeader = "X-IP-HEADER";
const PAGE_SIZE = 10;

const contactAttributes = ["firstName", "middleName", "lastName", "emailId", "emailVerified", "phoneNumber", "mobileNumber", "mobileVerified", "faxNumber", "companyName", "address1", "address2", "city", "state", "country", "zipCode", "createdDate", "lastUpdatedDate"];
const filterAttributes = ["enabled", "contactCode", "createdBy"];


// module.exports = (router) => {
//
//   router.route('/contact/')
//     .get((req, res, next) => {
//       const tenantId = req.header(tenantHeader);
//       const createdBy = req.header(userHeader);
//       const ipAddress = req.header(ipHeader);
//       const response = {
//         "status": "200",
//         "description": "",
//         "data": {}
//       };
//       debug("query: " + JSON.stringify(req.query));
//       var limit = _.get(req.query, "limit", LIMIT);
//       var pageSize = _.get(req.query, "pageSize", PAGE_SIZE);
//       var pageNo = _.get(req.query, "pageSize", 1);
//       var skipCount = (pageNo - 1) * pageSize;
//       var filter = _.pick(req.query, filterAttributes);
//       var sort = _.get(req.query, "sort", {});
//       var orderby = sortable(sort);
//
//       try {
//         contact.find(tenantId, createdBy, ipAddress, filter, orderby, skipCount, limit)
//           .then((contacts) => {
//             if (contacts.length > 0) {
//               response.status = "200";
//               response.description = "SUCCESS";
//               response.data = contacts;
//               res.status(200)
//                 .send(JSON.stringify(response, null, 2));
//             } else {
//               response.status = "204";
//               response.description = "No contacts found";
//               debug("response: " + JSON.stringify(response));
//               res.status(200)
//                 .send(JSON.stringify(response, null, 2));
//             }
//           })
//           .catch((e) => {
//             debug(`failed to fetch all contacts ${e}`);
//             res.status(400)
//               .json({
//                 error: e.toString()
//               });
//           });
//       } catch (e) {
//         debug(`caught exception ${e}`);
//         res.status(400)
//           .json({
//             error: e.toString()
//           });
//       }
//     });
// };
//
// function sortable(sort) {
//   if (typeof sort === 'undefined' ||
//     sort == null) {
//     return {};
//   }
//   if (typeof sort === 'string') {
//     var result = sort.split(",")
//       .reduce((temp, sortParam) => {
//         if (sortParam.charAt(0) == "-") {
//           return _.assign(temp, _.fromPairs([
//             [sortParam.replace(/-/, ""), -1]
//           ]));
//         } else {
//           return _.assign(_.fromPairs([
//             [sortParam.replace(/\+/, ""), 1]
//           ]));
//         }
//       }, {});
//     return result;
//   } else {
//     return {};
//   }
// }

module.exports = (router) => {

  router.route('/contact/')
    .get((req, res, next) => {
      const tenantId = req.header(tenantHeader);
      //const createdBy = req.header(userHeader);
      const ipAddress = req.header(ipHeader);
      const response = {
        "status": "200",
        "description": "",
        "data": {}
      };
      debug("query: " + JSON.stringify(req.query));
      var limit = _.get(req.query, "limit", LIMIT);
      var pageSize = _.get(req.query, "pageSize", PAGE_SIZE);
      var pageNo = _.get(req.query, "pageSize", 1);
      var skipCount = (pageNo - 1) * pageSize;
      //var filter = _.pick(req.query, filterAttributes);
      //var sort = _.get(req.query, "sort", {});
      //  var orderby = sortable(sort);

      try {
        console.log(tenantId, ipAddress, limit);
        contact.find(tenantId, ipAddress, limit)
          .then((contacts) => {
            if (contacts.length > 0) {
              response.status = "200";
              response.description = "SUCCESS";
              response.data = contacts;
              res.status(200)
                .send(JSON.stringify(response, null, 2));
            } else {
              response.status = "204";
              response.description = "No contacts found";
              debug("response: " + JSON.stringify(response));
              res.status(200)
                .send(JSON.stringify(response, null, 2));
            }
          })
          .catch((e) => {
            console.log("er", e);
            debug(`failed to fetch all contacts ${e}`);
            res.status(400)
              .json({
                error: e.toString()
              });
          });
      } catch (e) {
        console.log("er1", e);
        debug(`caught exception ${e}`);
        res.status(400)
          .json({
            error: e.toString()
          });
      }
    });
};

// function sortable(sort) {
//   if (typeof sort === 'undefined' ||
//     sort == null) {
//     return {};
//   }
//   if (typeof sort === 'string') {
//     var result = sort.split(",")
//       .reduce((temp, sortParam) => {
//         if (sortParam.charAt(0) == "-") {
//           return _.assign(temp, _.fromPairs([
//             [sortParam.replace(/-/, ""), -1]
//           ]));
//         } else {
//           return _.assign(_.fromPairs([
//             [sortParam.replace(/\+/, ""), 1]
//           ]));
//         }
//       }, {});
//     return result;
//   } else {
//     return {};
//   }
// }