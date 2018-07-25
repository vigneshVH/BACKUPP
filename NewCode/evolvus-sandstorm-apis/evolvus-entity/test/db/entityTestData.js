module.exports.validObject1 = {
  // valid entity object
  "tenantId": "IVL",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "entityCode": "entity1",
  "name": "headOffice",
  "parent": "headOffice",
  "description": "bc1 description",
  "createdBy": "SYSTEM",
  "createdDate": "2018-07-05T12:25:22.895Z",
  "lastUpdatedDate": "2018-07-05T12:25:22.895Z",
  "accessLevel": "1",
  "enableFlag": 1,
  "entityId": "abc12"
};

module.exports.validObject2 = {
  // valid entity object
  "tenantId": "IVL",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "entityCode": "entity2",
  "name": "southZone",
  "parent": "headOffice",
  "description": "southZone description",
  "createdBy": "SYSTEM",
  "createdDate": "2018-06-05T12:25:22.895Z",
  "lastUpdatedDate": "2018-06-05T12:25:22.895Z",
  "accessLevel": "2",
  "enableFlag": 1,
  "entityId": "abc12def34"
};

module.exports.validObject3 = {
  // valid entity object
  "tenantId": "IVL",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "entityCode": "entity3",
  "name": "northZone",
  "parent": "headOffice",
  "description": "northZone description",
  "createdBy": "SYSTEM",
  "createdDate": "2018-05-05T12:25:22.895Z",
  "lastUpdatedDate": "2018-05-05T12:25:22.895Z",
  "accessLevel": "2",
  "enableFlag": 1,
  "entityId": "abc12ghi56"
};

module.exports.validObject4 = {
  // valid entity object
  "tenantId": "IVL",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "entityCode": "entity4",
  "name": "tamilNadu",
  "parent": "southZone",
  "description": "tamilNadu description",
  "createdBy": "SYSTEM",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString(),
  "accessLevel": "3",
  "enableFlag": 1,
  "entityId": "abc12def34tyu78"
};

module.exports.validObject5 = {
  // valid entity object
  "tenantId": "IVL",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "entityCode": "entity5",
  "name": "karnataka",
  "parent": "southZone",
  "description": "southZone description",
  "createdBy": "SYSTEM",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString(),
  "accessLevel": "3",
  "enableFlag": 1,
  "entityId": "abc12def34jki78"
};

module.exports.validObject6 = {
  // valid entity object
  "tenantId": "IVL",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "entityCode": "entity6",
  "name": "mumbai",
  "parent": "northZone",
  "description": "mumbai description",
  "createdBy": "SYSTEM",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString(),
  "accessLevel": "3",
  "enableFlag": 1,
  "entityId": "abc12ghi56jik34"
};

module.exports.validObject7 = {
  // valid entity object
  "tenantId": "IVL",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "entityCode": "entity7",
  "name": "maharastra",
  "parent": "northZone",
  "contact": {
    "tenantId": "IVL",
    "firstName": "vignesh",
    "middleName": "varan",
    "lastName": "p",
    "emailId": "xyz@gmail.com",
    "emailVerified": true,
    "phoneNumber": "111111111"
  },
  "description": "maharastra description",
  "createdBy": "SYSTEM",
  "createdDate": "2018-04-05T12:25:22.895Z",
  "lastUpdatedDate": "2018-04-05T12:25:22.895Z",
  "accessLevel": "3",
  "enableFlag": 1,
  "entityId": "abc12ghi56sde90"
};

module.exports.validObject8 = {
  // valid entity object
  "tenantId": "IVL",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "entityCode": "entity8",
  "name": "chennai",
  "parent": "tamilNadu",
  "contact": {
    "tenantId": "IVL",
    "firstName": "vignesh",
    "middleName": "varan",
    "lastName": "p",
    "emailId": "xyz@gmail.com",
    "emailVerified": true,
    "phoneNumber": "111111111"
  },
  "description": "chennai description",
  "createdBy": "SYSTEM",
  "createdDate": "2018-07-05T12:25:22.895Z",
  "lastUpdatedDate": "2018-07-05T12:25:22.895Z",
  "accessLevel": "4",
  "enableFlag": "1",
  "entityId": "abc12def34tyu78hju67"
};

module.exports.invalidObject1 = {
  // invalid entity object
  "tenantId": "IVL",
  "parent": "headOffice",
  "description": "northZone description",
  "createdBy": "SYSTEM",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString(),
  "accessLevel": "2",
  "entityId": "abc12ghi56"
};