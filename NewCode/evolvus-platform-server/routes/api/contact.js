const debug = require("debug")("evolvus-platform-server:routes:api:contact");
const _ = require("lodash");
const contact = require("@evolvus/evolvus-contact");
const shortid = require('shortid');
const LIMIT = process.env.LIMIT || 10;
const tenantHeader = "X-TENANT-ID";
const userHeader = "X-USER";
const ipHeader = "X-IP-HEADER";
const PAGE_SIZE = 10;

const contactAttributes = ["contactName", "contactId", "description", "enabled", "contactCode", "createdBy", "createdDate", "logo", "favicon"];

var filterAttributes = contact.filterAttributes;
var sortAttributes = contact.sortableAttributes;


module.exports = (router) => {
  router.route('/contact/')
    .get((req, res, next) => {
      const tenantId = req.header(tenantHeader);
      const createdBy = req.header(userHeader);
      const ipAddress = req.header(ipHeader);
      console.log(tenantId, createdBy, ipAddress);
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
      var filter = _.pick(req.query, filterAttributes);
      var sort = _.get(req.query, "sort", {});
      var orderby = sortable(sort);

      try {
        debug(`getAll API.tenantId :${tenantId}, filter :${JSON.stringify(filter)}, orderby :${JSON.stringify(orderby)}, skipCount :${skipCount}, limit :${limit} ,are parameters`);
        contact.find(tenantId, filter, orderby, skipCount, limit)
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
            var reference = shortid.generate();
            debug(`find promise failed due to :${e} and referenceId :${referenceId}`);
            res.status(400)
              .json({
                error: e.toString()
              });
          });
      } catch (e) {
        var reference = shortid.generate();
        debug(`try catch failed due to :${e} and referenceId :${referenceId}`);
        res.status(400)
          .json({
            error: e.toString()
          });
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