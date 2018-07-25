const mongoose = require("mongoose");
const validator = require("validator");

var contactSchema = new mongoose.Schema({
  // Add all attributes below tenantId
  tenantId: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 64
  },
  firstName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50
  },
  middleName: {
    type: String,
    minLength: 1,
    maxLength: 50
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50
  },
  emailId: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 50,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
      isAsync: false
    }
  },
  emailVerified: {
    type: Boolean
  },
  phoneNumber: {
    type: String,
    minLength: 5,
    maxLength: 15,
    validate: {
      validator: function(v) {
        return /^[0-9\-\+]+$/.test(v);
      },
      message: "{PATH} can contain only Numbers"
    }
  },
  mobileNumber: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 15,
    validate: {
      validator: function(v) {
        return /^[0-9\-\+]+$/.test(v);
      },
      message: "{PATH} can contain only Numbers"
    }
  },
  mobileVerified: {
    type: Boolean
  },
  faxNumber: {
    type: String,
    minLength: 9,
    maxLength: 15,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9\-\+]+$/.test(v);
      },
      message: "{PATH} can contain only Numbers"
    }
  },
  companyName: {
    type: String,
    minLength: 1,
    maxLength: 64
  },
  address1: {
    type: String
  },
  address2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zipCode: {
    type: String
  },
  createdDate: {
    type: Date,
    required: true
  },
  lastUpdatedDate: {
    type: Date,
    required: true
  }
});



module.exports = contactSchema;
contactSchema.index({
  tenantId: 1,
  emailId: 1,
  mobileNumber:1,
  phoneNumber: 1
}, {
  unique: true
});
module.exports = contactSchema;
