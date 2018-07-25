const mongoose = require("mongoose");
const validator = require("validator");

var applicationSchema = new mongoose.Schema({
  // Add all attributes below tenantId
  tenantId: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 64
  },
  applicationCode: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  applicationName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
    validate: {
      validator: function(v) {
        return /^[A-Za-z ]*$/.test(v);
      },
      message: "{PATH} can contain only alphabets and spaces"
    }
  },
  enableFlag: {
    type: String,
    default: true,
    enum: ["0", "1"]
  },
  description: {
    type: String,
    minlength: 0,
    maxlength: 255
  },
  logo: {
    type: String
  },
  favicon: {
    type: String
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String
  },
  createdDate: {
    type: Date,
    required: true
  },
  updatedDate: {
    type: Date
  }
});

module.exports = applicationSchema;

applicationSchema.index({
  tenantId: 1,
  applicationCode: 2
}, {
  unique: true
});

module.exports = applicationSchema;