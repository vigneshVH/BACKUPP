const debug = require("debug")("evolvus-platform-server:routes:api:role");
const _ = require("lodash");
const role = require("./../../index");

const LIMIT = process.env.LIMIT || 10;
const tenantHeader = "X-TENANT-ID";
const userHeader = "X-USER";
const ipHeader = "X-IP-HEADER";
const PAGE_SIZE = 10;

const roleAttributes = ["roleName", "roleId", "description", "enabled", "roleCode", "createdBy", "createdDate", "logo", "favicon"];
const filterAttributes = ["enabled", "roleCode", "createdBy"];


module.exports = (router) => {

    router.route('/role/')
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
            var skipCount = (pageNo - 1) * pageSize;
            var filter = _.pick(req.query, filterAttributes);
            var sort = _.get(req.query, "sort", {});
            var orderby = sortable(sort);

            try {
                role.find(tenantId, createdBy, ipAddress, filter, orderby, skipCount, limit)
                    .then((roles) => {
                        if (roles.length > 0) {
                            response.status = "200";
                            response.description = "SUCCESS";
                            response.data = roles;
                            res.status(200)
                                .send(JSON.stringify(response, null, 2));
                        } else {
                            response.status = "204";
                            response.description = "No roles found";
                            debug("response: " + JSON.stringify(response));
                            res.status(200)
                                .send(JSON.stringify(response, null, 2));
                        }
                    })
                    .catch((e) => {
                        debug(`failed to fetch all roles ${e}`);
                        res.status(400)
                            .json({
                                error: e.toString()
                            });
                    });
            } catch (e) {
                debug(`caught exception ${e}`);
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