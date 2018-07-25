const _ = require('lodash');
/*
 ** JSON Schema representation of the contact model
 */
var healthCheckSchema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "healthCheckModel",
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20,
      "filterAttributes": false,
      "sortableAttributes": false
    },
    "saveTime": {
      "type": "string",
      "format": "date-time",
      "filterable": false, //custom attributes
      "sortable": false //custom attributes

    }
  },
  "required": ["status"]
};

module.exports.schema = healthCheckSchema;

filterAttributes = _.keys(_.pickBy(healthCheckSchema.properties, (a) => {
  return (a.filterable);
}));

module.exports.filterAttributes = filterAttributes;

sortableAttributes = _.keys(_.pickBy(healthCheckSchema.properties, (a) => {
  return (a.sortable);
}));

module.exports.sortableAttributes = sortableAttributes;