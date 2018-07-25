const mongoose = require("mongoose");
const validator = require("validator");

var masterTimeZoneSchema = new mongoose.Schema({
  // Add all attributes below tenantId
  tenantId: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 64
  },
  zoneCode: {
    type: String,
    minLength: 1,
    maxLength: 50,
    required: true
  },
  zoneName: {
    type: String,
    minLength: 1,
    maxLength: 50,
    required: true
  },
  offsetValue: {
    type: String
  },
  createdDate: {
    type: String,
    format: Date
  },
  lastUpdatedDate: {
    type: String,
    format: Date
  },
  createdBy: {
    type: String,
    minLength: 1,
    maxLength: 100
  },
  updatedBy: {
    type: String,
    minLength: 1,
    maxLength: 100
  },
  offSet: {
    type: String
  },
  objVersion: {
    type: Number
  },
  enableFlag: {
    type: String,
    default: "1",
    enum: ["0", "1"]
  }

});

module.exports = masterTimeZoneSchema;

masterTimeZoneSchema.index({
  tenantId: 1,
  zoneName: 2
}, {
  unique: true
});
// masterTimeZoneSchema.index({
//   //tenantId: 1,
//   zoneCode: 1,
//   zoneName: 2
// }, {
//   unique: true
// });

module.exports = masterTimeZoneSchema;