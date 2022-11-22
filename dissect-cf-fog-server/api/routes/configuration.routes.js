const express = require('express');
const authJwt = require("../../middleware").authJwt;
const router = express.Router({caseSensitive:true});
const { isEmpty } = require('lodash');
const Parser = require("fast-xml-parser").j2xParser;
const apiUtils = require('../util');
const mongodb = require('../../services/mongodb-service');


// TODO remove console.logs
/**
 * It parses the appliacnes and devices to xml and writes out into files. The path consists of the email and and the time.
 * It runs the dissect application, and sends the directory's name, the html file in string format, stdout and an error property,
 * if it is failed somehow, it will try to delete the created folder and it will send an error response.
 */
router.post('/', [authJwt.verifyToken], async (req, res) => {
  console.log("--------------------- REQUEST BODY --------------------")
  console.log(JSON.stringify(req.body));
  console.log("---------------------- REQUEST BODY END ---------------");

  const jobs = [];
  const configs = [];

  for (let config of req.body) {
    console.log(config);
    configs.push(config.configuration);
  }

  for (let config of configs) {
    console.log("FOR LOOP - actual config: " + config);
    if (!checkConfigurationRequestBody(config)) {
      console.log('ERROR: Bad req body: ', config);
      throw new Error('Bad request!');
    }

    let obj = await saveResourceFiles(config);
    console.log(obj);

    const prov = await mongodb.getProvidersFile({
      filename: "providers.xml"
    })

    let configFiles = {};
    configFiles["APPLIANCES_FILE"] = obj.appliancesId;
    configFiles["DEVICES_FILE"] = obj.devicesId;
    configFiles["INSTANCES_FILE"] = obj.instancesId;
    configFiles["PROVIDERS_FILE"] = prov.fileId;

    const resources = await mongodb.getResourceFiles();

    let counter = 0;

    for (const item of resources) {
      configFiles["IAAS_FILE" + counter] = item.fileId;
      counter += 1;
    }

    const job = await mongodb.addJob({
      user: req.userId,
      priority: "101",
      numberOfCalculation: 0,
      simulatorJobStatus: "SUBMITTED",
      configFiles: configFiles,
      createdDate: new Date().toISOString()
    })

    jobs.push(job.insertedId);

    console.log("JOB ID=" + JSON.stringify(job));

    console.log("Req user id: " + req.userId);
  }
  console.log('jobs=' + jobs);

  const user_config = await mongodb.addConfiguration({
    user: req.userId,
    time: new Date().toISOString(),
    jobs: jobs
  })

  console.log('user_config=' + user_config);

  return res.status(201).json({jobs: jobs});
});


/**
 * It wrties the files into the given directory. The data comes from the request' body.
 * @param {Request} req
 * @param {Parser} parser
 * @param {string} baseDirPath
 */
async function saveResourceFiles(config) {
  const parser = new Parser(apiUtils.getParserOptions('$'));

  const plainAppliances = config.appliances;
  const plainDevices = config.devices;
  const plainInstances = config.instances;

  console.log("plainAppliances: " + config.appliances);
  console.log("plainDevices: " + config.devices);
  console.log("plainInstances: " + config.instances);

  const appliances = parser.parse(plainAppliances);
  console.log("parsed appliances: " + appliances);
  const devices = parser.parse(plainDevices);
  console.log("parsed devices: " + devices);
  const instances = parser.parse(plainInstances);
  console.log("parsed instances: " + instances);

  const xmlFileHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

  const appliancesId = await mongodb.saveFile('appliances.xml',xmlFileHeader + appliances);

  const devicesId = await mongodb.saveFile('devices.xml', xmlFileHeader + devices);

  const instancesId = await mongodb.saveFile('Instances.xml', xmlFileHeader + instances);

  return {
    appliancesId: appliancesId,
    devicesId: devicesId,
    instancesId: instancesId
  }
}

/**
 * @param {Request} req
 */
function checkConfigurationRequestBody(req){
  return req.appliances
      && req.devices && !isEmpty(req.appliances)
      && !isEmpty(req.devices)
}

module.exports = router
