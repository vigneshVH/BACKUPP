const debug = require("debug")("evolvus-platform-server:routes:api:masterTimeZone");
const _ = require("lodash");
const masterTimeZone = require("./../../index");
const shortid = require('shortid');
const LIMIT = process.env.LIMIT || 10;
const tenantHeader = "X-TENANT-ID";
const userHeader = "X-USER";
const ipHeader = "X-IP-HEADER";
const PAGE_SIZE = 10;

const mastermasterTimeZoneAttributes = ["zoneCode", "zoneName", "offsetValue", "createdDate", "lastUpdatedDate", "createdBy", "updatedBy", "enableFlag", "offSet", "objVersion"];

const filterAttributes = masterTimeZone.filterAttributes;
const sortAttributes = masterTimeZone.sortAttributes;



module.exports = (router) => {
  router.route('/masterTimeZone/')
    .get((req, res, next) => {
      const tenantId = req.header(tenantHeader);
      const createdBy = req.header(userHeader);
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
      var skipCount = pageSize * (pageNo - 1);
      var filter = _.pick(req.query, filterAttributes);
      var sort = _.get(req.query, "sort", {});
      var orderby = sortable(sort);

      try {
        debug(`getAll API.tenantId :${tenantId} ,filter :${JSON.stringify(filter)},orderby :${JSON.stringify(orderby)},skipCount :${skipCount} ,limit :${limit} are parameters`);
        Promise.all([masterTimeZone.find(tenantId, filter, orderby, skipCount, +limit), masterTimeZone.find(tenantId, filter, orderby, 0, 0)])
          .then((result) => {
            if (result[0].length > 0) {
              response.status = "200";
              response.description = "SUCCESS";
              response.totalNoOfPages = Math.ceil(result[1].length / pageSize);
              response.totalNoOfRecords = result[1].length;
              response.data = result[0];
              debug("response: " + JSON.stringify(response));
              res.status(200)
                .send(JSON.stringify(response, null, 2));
            } else {
              response.status = "200";
              response.description = "No masterTimeZone found";
              response.totalNoOfRecords = result[1].length;
              response.totalNoOfPages = 0;
              debug("response: " + JSON.stringify(response));
              res.status(response.status)
                .send(JSON.stringify(response, null, 2));
            }
          })
          .catch((e) => {
            var reference = shortid.generate();
            debug(`getAll promise failed due to :${e} and referenceid :${reference}`);
            debug(`failed to fetch all masterTimeZone ${e}`);
            response.status = "400",
              response.description = `Unable to fetch all masterTimeZone`
            response.data = e.toString()
            res.status(response.status).send(JSON.stringify(response, null, 2));
          });
      } catch (e) {
        var reference = shortid.generate();
        debug(`try catch failed due to :${e} and referenceid :${reference}`);
        debug(`caught exception ${e}`);
        response.status = "400",
          response.description = `Unable to fetch all masterTimeZone`
        response.data = e.toString()
        res.status(response.status).send(JSON.stringify(response, null, 2));
      }
    });
};

function sortable(sort) {
  if (typeof sort === 'undefined' ||
    sort == null) {
    return {};
  }
  if (typeof sort === 'string') {
    var result = sort.split(",")
      .reduce((temp, sortParam) => {
        if (sortParam.charAt(0) == "-") {
          return _.assign(temp, _.fromPairs([
            [sortParam.replace(/-/, ""), -1]
          ]));
        } else {
          return _.assign(_.fromPairs([
            [sortParam.replace(/\+/, ""), 1]
          ]));
        }
      }, {});
    return result;
  } else {
    return {};
  }
}