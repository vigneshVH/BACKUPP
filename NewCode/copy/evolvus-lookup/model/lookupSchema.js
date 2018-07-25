const _ = require('lodash');
/*
 ** JSON Schema representation of the lookup model
 */
var lookupSchema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "lookupModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "maxLength": 64,
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "lookupCode": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20,
      "filterable": true, //custom attributes
      "sortable": true //custom attributes
    },
    "value": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "valueOne": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "valueTwo": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "valueThree": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "valueFour": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "enabled": {
      "type": "string",
      "default": "1",
      "filterable": true, //custom attributes
      "sortable": true //custom attributes
    },
    "createdBy": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": true //custom attributes
    },
    "updatedBy": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": true //custom attributes
    },
    "createdDate": {
      "type": "string",
      "format": "date-time",
      "filterable": true, //custom attributes
      "sortable": true //custom attributes
    },
    "updatedDate": {
      "type": ["string", "null"],
      "format": "date-time",
      "filterable": false, //custom attributes
      "sortable": true //custom attributes
    }
  },
  "required": ["tenantId", "lookupCode", "value", "createdBy", "createdDate"]
};

module.exports.schema = lookupSchema;

filterAttributes = _.keys(_.pickBy(lookupSchema.properties, (a) => {
  return (a.filterable);
}));

module.exports.filterAttributes = filterAttributes;

sortableAttributes = _.keys(_.pickBy(lookupSchema.properties, (a) => {
  return (a.sortable);
}));

module.exports.sortableAttributes = sortableAttributes;
module.exports.schema = lookupSchema;