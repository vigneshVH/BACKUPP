const mongoose = require("mongoose");
const validator = require("validator");

var healthChecktSchema = new mongoose.Schema({
  // Add all attributes below tenantId
  status: {
    type: String,
    minLength: 3,
    maxLength: 20
  },
  saveTime: {
    type: Date
  }
});



module.exports = healthChecktSchema;
healthChecktSchema.index({
  status: 1
}, {
  unique: true
});
module.exports = healthChecktSchema;